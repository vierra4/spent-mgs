from fastapi import APIRouter, BackgroundTasks, UploadFile, Depends
from models.models import SpendEvent
from services.receipt_service import attach_receipt
from auth.dependencies import get_current_user
from pydantic import BaseModel

router = APIRouter(prefix="/receipts", tags=["Receipts"])
class ReceiptUploadRequest(BaseModel):
    spend_id: str
    file_url: str

@router.post("")
async def upload_receipt(file: UploadFile, spend_id: str, background_tasks: BackgroundTasks, user=Depends(get_current_user)):
    spend = await SpendEvent.get(id=spend_id)

    file_bytes = await file.read()

    receipt = await attach_receipt(
        spend=spend,
        file_bytes=file_bytes,
        background_tasks=background_tasks
    )

    return receipt
