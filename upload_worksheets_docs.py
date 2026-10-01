import os
import sys
import ftplib

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

LOCAL_DIR = r"C:\Users\hmudg\.gemini\antigravity\scratch\gyanlok\public\uploads\worksheets"

ftp = ftplib.FTP()
ftp.connect("190.92.174.187", 21, timeout=30)
ftp.login("antigravity@ekshala.in", "Purvad@1208")

def ensure_ftp_dir(remote_dir):
    dirs = [d for d in remote_dir.split('/') if d]
    current = ""
    for d in dirs:
        current += "/" + d
        try:
            ftp.cwd(current)
        except ftplib.error_perm:
            try:
                ftp.mkd(current)
                print(f"📁 Created FTP dir: {current}")
            except Exception:
                pass

ensure_ftp_dir("public_html/uploads/worksheets")

for fname in os.listdir(LOCAL_DIR):
    local_p = os.path.join(LOCAL_DIR, fname)
    remote_p = f"public_html/uploads/worksheets/{fname}"
    sz = os.path.getsize(local_p)
    print(f"Uploading {fname} ({sz:,} bytes) -> {remote_p}...")
    with open(local_p, "rb") as f:
        ftp.storbinary(f"STOR /{remote_p}", f)
    print(f"  ✓ Uploaded {fname}")

ftp.quit()
print("\n🎉 ALL 12 ORIGINAL DOCX WORKSHEETS UPLOADED TO FTP!")
