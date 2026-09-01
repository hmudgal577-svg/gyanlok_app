import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

sender_email = "hmudgal577@gmail.com"
app_password = "jaraudlxplmgotrw"
receiver_email = "hmudgal577@gmail.com"

message = MIMEMultipart("alternative")
message["Subject"] = "🔐 GyanLok Admin Login OTP (Gmail SMTP Direct Test)"
message["From"] = f"GyanLok Admin <{sender_email}>"
message["To"] = receiver_email

html = """\
<html>
  <body>
    <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f8fafc;border-radius:12px;">
      <h2 style="color:#1a2740;margin-bottom:8px;">GyanLok Admin Login</h2>
      <p style="color:#555;margin-bottom:24px;">Your One-Time Password (OTP) for admin login:</p>
      <div style="background:#1a2740;color:#fff;font-size:36px;font-weight:bold;letter-spacing:12px;text-align:center;padding:24px;border-radius:8px;">739502</div>
      <p style="color:#888;margin-top:20px;font-size:13px;">⏱ This OTP is valid for <strong>5 minutes</strong> only.</p>
    </div>
  </body>
</html>
"""

part = MIMEText(html, "html")
message.attach(part)

try:
    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(sender_email, app_password)
        server.sendmail(sender_email, receiver_email, message.as_string())
    print("SUCCESSFULLY SENT EMAIL VIA GMAIL SMTP!")
except Exception as e:
    print("GMAIL SMTP ERROR:", e)
