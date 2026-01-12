import logging
from io import BytesIO
from typing import Optional

from fastapi import APIRouter, HTTPException, Depends, Response
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from app.dependencies.auth import get_current_user, AuthenticatedUser
import markdown
try:
    from xhtml2pdf import pisa
except ImportError:
    # Fallback if xhtml2pdf is not available
    pisa = None

logger = logging.getLogger(__name__)
router = APIRouter()


class PDFRequest(BaseModel):
    """Request model for PDF generation."""
    calendar_text: str = Field(..., description="Markdown calendar content to convert to PDF")
    title: Optional[str] = Field(default="Content Calendar", description="PDF title")
    duration_days: Optional[int] = Field(default=None, description="Calendar duration in days")
    platforms: Optional[list] = Field(default=None, description="Platforms included in calendar")


def convert_html_to_pdf(html_content: str) -> BytesIO:
    """
    Convert HTML content to PDF using xhtml2pdf.

    Args:
        html_content: HTML string to convert

    Returns:
        BytesIO object containing PDF data

    Raises:
        Exception if PDF generation fails
    """
    if pisa is None:
        raise Exception("xhtml2pdf library is not installed. Please install it with: pip install xhtml2pdf")

    result = BytesIO()

    # Create PDF
    pdf = pisa.CreatePDF(
        BytesIO(html_content.encode('utf-8')),
        result,
        encoding='utf-8'
    )

    if pdf.err:
        raise Exception(f"PDF generation failed: {pdf.err}")

    result.seek(0)
    return result


def markdown_to_html(markdown_text: str, title: str = "Content Calendar", duration_days: Optional[int] = None, platforms: Optional[list] = None) -> str:
    """
    Convert markdown to HTML with proper styling for PDF.

    Args:
        markdown_text: Markdown content
        title: PDF title
        duration_days: Duration in days (for header)
        platforms: List of platforms (for header)

    Returns:
        HTML string with embedded styles
    """
    # Convert markdown to HTML
    html_body = markdown.markdown(
        markdown_text,
        extensions=['extra', 'nl2br', 'tables', 'fenced_code']
    )

    # Create full HTML document with styles
    platforms_str = ", ".join(platforms) if platforms else "Multiple Platforms"
    duration_str = f"{duration_days} days" if duration_days else ""

    html = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>{title}</title>
    <style>
        @page {{
            size: A4;
            margin: 20mm;
        }}

        body {{
            font-family: Arial, sans-serif;
            font-size: 11pt;
            line-height: 1.6;
            color: #000000;
            margin: 0;
            padding: 0;
        }}

        .header {{
            background: linear-gradient(135deg, #FF6527 0%, #FFA17B 100%);
            color: white;
            padding: 20px;
            margin-bottom: 20px;
            border-radius: 8px;
        }}

        .header h1 {{
            margin: 0 0 10px 0;
            font-size: 24pt;
            font-weight: bold;
        }}

        .header p {{
            margin: 5px 0;
            font-size: 12pt;
        }}

        .info-box {{
            background-color: #E3F2FD;
            border: 1px solid #90CAF9;
            border-radius: 4px;
            padding: 12px;
            margin-bottom: 20px;
        }}

        .info-box p {{
            margin: 5px 0;
            color: #1565C0;
        }}

        h1 {{
            color: #FF6527;
            font-size: 20pt;
            margin-top: 25pt;
            margin-bottom: 12pt;
            page-break-after: avoid;
            border-bottom: 2px solid #FF6527;
            padding-bottom: 5pt;
        }}

        h2 {{
            color: #FF6527;
            font-size: 16pt;
            margin-top: 20pt;
            margin-bottom: 10pt;
            page-break-after: avoid;
        }}

        h3 {{
            color: #333333;
            font-size: 14pt;
            margin-top: 15pt;
            margin-bottom: 8pt;
            page-break-after: avoid;
        }}

        h4 {{
            color: #555555;
            font-size: 12pt;
            margin-top: 12pt;
            margin-bottom: 6pt;
            page-break-after: avoid;
        }}

        p {{
            margin-bottom: 8pt;
            text-align: justify;
        }}

        ul, ol {{
            margin-bottom: 10pt;
            padding-left: 25pt;
        }}

        li {{
            margin-bottom: 5pt;
        }}

        ul li::marker {{
            color: #FF6527;
        }}

        strong {{
            color: #000000;
            font-weight: bold;
        }}

        em {{
            font-style: italic;
        }}

        code {{
            background-color: #F5F5F5;
            padding: 2pt 4pt;
            border-radius: 3pt;
            font-family: 'Courier New', monospace;
            font-size: 10pt;
            color: #000000;
        }}

        pre {{
            background-color: #F5F5F5;
            border: 1px solid #DDDDDD;
            border-radius: 4pt;
            padding: 10pt;
            overflow-x: auto;
            page-break-inside: avoid;
        }}

        pre code {{
            background-color: transparent;
            padding: 0;
        }}

        table {{
            width: 100%;
            border-collapse: collapse;
            margin: 15pt 0;
            page-break-inside: avoid;
        }}

        table th {{
            background-color: #FF6527;
            color: white;
            padding: 8pt;
            text-align: left;
            font-weight: bold;
            border: 1px solid #DDDDDD;
        }}

        table td {{
            padding: 8pt;
            border: 1px solid #DDDDDD;
        }}

        table tr:nth-child(even) {{
            background-color: #F9F9F9;
        }}

        blockquote {{
            border-left: 4px solid #FF6527;
            padding-left: 15pt;
            margin: 15pt 0;
            color: #555555;
            font-style: italic;
        }}

        hr {{
            border: none;
            border-top: 2px solid #FF6527;
            margin: 20pt 0;
        }}

        a {{
            color: #FF6527;
            text-decoration: none;
        }}

        .page-break {{
            page-break-before: always;
        }}

        @media print {{
            .header {{
                page-break-after: avoid;
            }}

            h1, h2, h3 {{
                page-break-after: avoid;
            }}

            table {{
                page-break-inside: avoid;
            }}
        }}
    </style>
</head>
<body>
    <div class="header">
        <h1>📅 {title}</h1>
        {f'<p><strong>Duration:</strong> {duration_str}</p>' if duration_str else ''}
        {f'<p><strong>Platforms:</strong> {platforms_str}</p>' if platforms else ''}
    </div>

    {html_body}
</body>
</html>"""

    return html


@router.post("/download-calendar-pdf")
async def download_calendar_pdf(
    payload: PDFRequest,
    user: AuthenticatedUser = Depends(get_current_user)
):
    """
    Generate and download calendar as PDF.
    Requires authentication via JWT token in Authorization header.

    Converts markdown calendar content to a well-formatted PDF document.
    """
    logger.info(
        f"PDF generation request from user {user.user_id} ({user.email})"
    )

    try:
        # Convert markdown to HTML
        html_content = markdown_to_html(
            payload.calendar_text,
            title=payload.title,
            duration_days=payload.duration_days,
            platforms=payload.platforms
        )

        # Convert HTML to PDF
        pdf_buffer = convert_html_to_pdf(html_content)

        # Generate filename
        from datetime import datetime
        filename = f"content-calendar-{datetime.now().strftime('%Y-%m-%d')}.pdf"

        # Return PDF as streaming response
        return StreamingResponse(
            pdf_buffer,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f'attachment; filename="{filename}"'
            }
        )

    except Exception as exc:
        logger.error(f"PDF generation error: {type(exc).__name__}: {exc}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate PDF: {str(exc)}"
        ) from exc

