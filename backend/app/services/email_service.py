from fastapi_mail import FastMail, MessageSchema, MessageType

from app.core.email import conf


async def send_email(
    recipients: list[str],
    subject: str,
    body: str,
):
    message = MessageSchema(
        subject=subject,
        recipients=recipients,
        body=body,
        subtype=MessageType.html,
    )

    fm = FastMail(conf)

    await fm.send_message(message)


async def send_booking_created_email(
    admin_email: str,
    booking_id: int,
    trader_email: str,
):
    await send_email(
        recipients=[admin_email],
        subject=f"New Booking #{booking_id}",
        body=f"""
        <h2>New Booking Created</h2>

        <p>A new booking has been created in CargoShare.</p>

        <ul>
            <li><b>Booking ID:</b> {booking_id}</li>
            <li><b>Created By:</b> {trader_email}</li>
        </ul>

        <p>Please login to CargoShare to review it.</p>
        """,
    )
async def send_booking_assigned_email(
    logistics_email: str,
    booking_id: int,
):
    await send_email(
        recipients=[logistics_email],
        subject=f"Booking #{booking_id} Assigned",
        body=f"""
        <h2>Booking Assigned</h2>

        <p>A booking has been assigned to you.</p>

        <ul>
            <li><b>Booking ID:</b> {booking_id}</li>
        </ul>

        <p>Please login to CargoShare to view shipment details.</p>
        """,
    )
async def send_payment_completed_email(
    trader_email: str,
    payment_id: int,
    amount: float,
):
    await send_email(
        recipients=[trader_email],
        subject="Payment Received Successfully",
        body=f"""
        <h2>Payment Successful</h2>

        <p>Your payment has been received successfully.</p>

        <table border="1" cellpadding="8" cellspacing="0">
            <tr>
                <td><b>Payment ID</b></td>
                <td>{payment_id}</td>
            </tr>

            <tr>
                <td><b>Amount</b></td>
                <td>₹{amount}</td>
            </tr>
        </table>

        <br>

        <p>Thank you for choosing CargoShare.</p>
        """,
    )

async def send_approval_email(
    user_email: str,
):
    await send_email(
        recipients=[user_email],
        subject="CargoShare Account Approved",
        body="""
        <h2>🎉 Congratulations!</h2>

        <p>Your CargoShare account has been approved by the administrator.</p>

        <p>You can now log in and access all the features of CargoShare.</p>

        <br>

        <p>Thank you for choosing CargoShare.</p>

        <p><b>CargoShare Team</b></p>
        """,
    )