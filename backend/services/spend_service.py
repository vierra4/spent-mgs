from models.models import SpendEvent
from services.audit_service import log_action
from services.policy_service import evaluate_policies
from services.idempotency_service import is_duplicate, record_key


async def create_spend_event(
    *,
    organization,
    user,
    amount,
    currency,
    spend_date,
    source,
    description=None,
    vendor=None,
    category=None,
    raw_metadata=None,
    idempotency_key: str | None = None
):
    
    if idempotency_key and await is_duplicate(idempotency_key):
        return await SpendEvent.get(raw_metadata__idempotency=idempotency_key)
    # Merge existing raw_metadata dict with idempotency key
    metadata = (raw_metadata or {}).copy()  # ensure it’s a dict
    if idempotency_key:
        metadata["idempotency"] = idempotency_key
    spend = await SpendEvent.create(
        organization=organization,
        user=user,
        vendor=vendor,
        category=category,
        amount=amount,
        currency=currency,
        spend_date=spend_date,
        source=source,
        description=description,
        raw_metadata=raw_metadata,
        status="pending",
        # raw_metadata={"idempotency": idempotency_key}
    )

    await log_action(
        organization=organization,
        actor=user,
        entity=spend,
        action="spend_created"
    )

    await evaluate_policies(spend)
    if idempotency_key:
        await record_key(
            key=idempotency_key,
            scope="spend_create",
            organization=organization
        )

    return spend
async def update_spend_after_receipt(spend, invoice_data):
    """
    Maps Gemini structured output to SpendEvent fields.
    """
    if invoice_data.total_amount:
        spend.amount = invoice_data.total_amount
    if invoice_data.date:
        spend.spend_date = invoice_data.date
    if invoice_data.vendor_name:
        # TODO: normalize vendor or create new Vendor entry
        spend.vendor = invoice_data.vendor_name
    await spend.save()
