from fastapi import BackgroundTasks
from models.models import Receipt
from services.audit_service import log_action
from services.spend_service import update_spend_after_receipt
from services.policy_service import evaluate_policies
from services.gemini_service import extract_receipt_data
from services.policy_service import auto_categorize_spend
from services.idempotency_service import is_duplicate, record_key
async def attach_receipt(spend, background_tasks: BackgroundTasks, file_bytes: bytes, file_url:None):
    receipt = await Receipt.create(
        spend_event=spend,
        file_url=file_url if file_url else None
    )
    

    await log_action(
        organization=spend.organization,
        actor=spend.user,
        entity=receipt,
        action="receipt_uploaded"
    )

    background_tasks.add_task(_process_receipt_ocr, receipt, file_bytes)

    return receipt

async def _process_receipt_ocr(receipt: Receipt, file_bytes: bytes):
    key = f"receipt_ocr:{receipt.id}"

    if await is_duplicate(key):
        return

    data = await extract_receipt_data(file_bytes=file_bytes)

    receipt.extracted_data = data.dict()
    receipt.is_verified = True
    await receipt.save()

    # Update SpendEvent fields
    await update_spend_after_receipt(receipt.spend_event, data)

    # Auto-categorize spend based on vendor
    await auto_categorize_spend(receipt.spend_event, data.vendor_name)

    # Re-run policy evaluation
    await evaluate_policies(receipt.spend_event)
    await record_key(
        key=key,
        scope="receipt_ocr",
        organization=receipt.spend_event.organization
    )
    await log_action(
        organization=receipt.spend_event.organization,
        actor=None,
        entity=receipt,
        action="receipt_processed",
        metadata=data.dict()
    )
    