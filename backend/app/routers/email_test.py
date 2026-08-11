from fastapi import APIRouter

from app.services.email_service import send_email

router = APIRouter(
    prefix="/email",
    tags=["Email"],
)


@router.get("/test")
async def test_email():
    await send_email(
        recipients=["farhanfaru0321@gmail.com"],
        subject="CargoShare Test Email",
        body="""
        <h2>Congratulations!</h2>
        <p>Your CargoShare email service is working successfully.</p>
        """,
    )

    return {
        "message": "Email sent successfully"
    }