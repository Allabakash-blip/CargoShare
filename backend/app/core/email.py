from fastapi_mail import ConnectionConfig

conf = ConnectionConfig(
    MAIL_USERNAME="farhanfaru0321@gmail.com",
    MAIL_PASSWORD="fdlx tfrr qmdo yzbg",
    MAIL_FROM="farhanfaru0321@gmail.com",
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True,
)