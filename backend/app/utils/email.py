async def send_approval_email(
    recipient: str,
):
    await send_email(
        recipients=[recipient],
        subject="CargoShare Registration Approved",
        body="""
        <h2>Congratulations!</h2>

        <p>Your CargoShare account has been approved by the administrator.</p>

        <p>You can now log in and start using the CargoShare platform.</p>

        <br>

        <p>Regards,</p>
        <p><b>CargoShare Team</b></p>
        """,
    )