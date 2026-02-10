import base64, os
from typing import Optional
from pydantic import BaseModel, Field
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage
from auth.config import get_settings
settings = get_settings()

# Structured Schema for receipts using pydantic
class LineItem(BaseModel):
    description: str = Field(description="The name or description of the item")
    quantity: int = Field(description="The number of units", default=1)
    price: float = Field(description="The price per unit")

class InvoiceData(BaseModel):
    vendor_name: str = Field(description="The name of the company that issued the invoice")
    date: Optional[str] = Field(description="The date of the invoice in YYYY-MM-DD format")
    items: list[LineItem] = Field(description="List of items purchased")
    total_amount: float = Field(description="The final total amount on the receipt")

#  Gemini structured LLM
llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0, api_key=settings.gemini_api_key)
structured_llm = llm.with_structured_output(InvoiceData)

SYSTEM_PROMPT = SystemMessage(
    content="You are a professional accounting assistant. Extract data accurately from receipts. "
            "If the date format is unclear, convert it to YYYY-MM-DD. If quantity is missing, assume 1."
)

async def extract_receipt_data(file_bytes: bytes = None, text_content: str = None) -> InvoiceData:
    """
    Uses Gemini via LangChain to extract structured invoice data.
    Can handle images (PDF or image) or raw text.
    """
    content_list = []

    if text_content:
        content_list.append({"type": "text", "text": text_content})

    if file_bytes:
        encoded_file = base64.b64encode(file_bytes).decode("utf-8")
        content_list.append({
            "type": "image_url",
            "image_url": {"url": f"data:application/octet-stream;base64,{encoded_file}"}
        })

    if not content_list:
        raise ValueError("No file bytes or text content provided")

    human_message = HumanMessage(content=content_list)
    response = await structured_llm.ainvoke([SYSTEM_PROMPT, human_message])

    return response
