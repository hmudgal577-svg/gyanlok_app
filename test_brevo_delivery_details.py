import urllib.request
import json

api_key = 'BREVO_API_KEY_REDACTED'

def brevo_get(path):
    req = urllib.request.Request(
        f'https://api.brevo.com/v3{path}',
        headers={
            'accept': 'application/json',
            'api-key': api_key
        }
    )
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode())
    except Exception as e:
        return {'error': str(e)}

print("--- 1. BREVO ACCOUNT ACCOUNT DETAILS ---")
account = brevo_get('/account')
print(json.dumps(account, indent=2))

print("\n--- 2. BREVO VERIFIED SENDERS ---")
senders = brevo_get('/senders')
print(json.dumps(senders, indent=2))

print("\n--- 3. RECENT TRANSACTIONAL LOGS ---")
logs = brevo_get('/smtp/statistics/events?limit=10')
print(json.dumps(logs, indent=2))
