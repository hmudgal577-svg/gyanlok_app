import urllib.request
import json

api_key = 'BREVO_API_KEY_REDACTED'

data = {
    "sender": {"name": "GyanLok Admin", "email": "mudgalharsh284@gmail.com"},
    "to": [{"email": "hmudgal577@gmail.com"}],
    "subject": "🔐 GyanLok Real Admin OTP Test",
    "htmlContent": "<h1 style='color:#3A7BD5;'>GyanLok Admin OTP</h1><p>Your OTP code is: <strong>849201</strong></p>"
}

req = urllib.request.Request(
    'https://api.brevo.com/v3/smtp/email',
    data=json.dumps(data).encode('utf-8'),
    headers={
        'accept': 'application/json',
        'api-key': api_key,
        'content-type': 'application/json'
    },
    method='POST'
)

try:
    with urllib.request.urlopen(req) as response:
        res_data = response.read().decode()
        print("BREVO API RESPONSE:", res_data)
except Exception as e:
    print("ERROR:", e)
