from models.models import User, Approval
import os
import aiosmtplib
from email.message import EmailMessage

SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
FROM_EMAIL = os.getenv("FROM_EMAIL", "no-reply@demo.com")


async def send_approval_notification(approval: Approval):
    approver: User = approval.approver
    spend = approval.spend_event

    if not approver or not approver.email:
        return

    msg = EmailMessage()
    msg["From"] = FROM_EMAIL
    msg["To"] = approver.email
    msg["Subject"] = "Approval required for spend"

    msg.set_content(
        f"""
Hello {approver.full_name},

A spend requires your approval.

Amount: {spend.amount} {spend.currency}
Description: {spend.description or "N/A"}
Submitted by: {spend.user.full_name if spend.user else "Unknown"}

Please log in to review and approve.

Thanks
"""
    )

    await aiosmtplib.send(
        msg,
        hostname=SMTP_HOST,
        port=SMTP_PORT,
        username=SMTP_USER,
        password=SMTP_PASSWORD,
        start_tls=True
    )
