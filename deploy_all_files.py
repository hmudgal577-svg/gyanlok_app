import os
import sys
import ftplib
import paramiko

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

LOCAL_PUBLIC_DIR = r"C:\Users\hmudg\.gemini\antigravity\scratch\gyanlok\public"
LOCAL_SCRATCH_DIR = r"C:\Users\hmudg\.gemini\antigravity\scratch\gyanlok"

# Files to upload
files_to_upload = [
    (os.path.join(LOCAL_PUBLIC_DIR, "style.css"), "public_html/style.css"),
    (os.path.join(LOCAL_PUBLIC_DIR, "script.js"), "public_html/script.js"),
    (os.path.join(LOCAL_SCRATCH_DIR, "grammar_converted_data.json"), "public_html/grammar_converted_data.json"),
    (os.path.join(LOCAL_PUBLIC_DIR, "grammar_converted_data.json"), "public_html/grammar_converted_data.json"),
    (os.path.join(LOCAL_PUBLIC_DIR, "hindi-grammar", "index.html"), "public_html/hindi-grammar/index.html"),
    (os.path.join(LOCAL_PUBLIC_DIR, "worksheets", "index.html"), "public_html/worksheets/index.html"),
    (os.path.join(LOCAL_PUBLIC_DIR, "index.html"), "public_html/index.html"),
    (os.path.join(LOCAL_PUBLIC_DIR, "sitemap.xml"), "public_html/sitemap.xml"),
    (os.path.join(LOCAL_PUBLIC_DIR, "robots.txt"), "public_html/robots.txt"),
]

# Recursively walk entire public folder to upload all generated pages, assets, and uploads
for root, dirs, filenames in os.walk(LOCAL_PUBLIC_DIR):
    for fname in filenames:
        if fname == 'chapter_html_content.json':
            continue
        full_p = os.path.join(root, fname)
        rel_p = os.path.relpath(full_p, LOCAL_PUBLIC_DIR).replace('\\', '/')
        item = (full_p, f"public_html/{rel_p}")
        if item not in files_to_upload:
            files_to_upload.append(item)

print(f"Total files to deploy: {len(files_to_upload)}")

def deploy_via_ftp():
    print("\n--- Trying FTP Deployment (antigravity@ekshala.in) ---")
    ftp = ftplib.FTP()
    ftp.connect("190.92.174.187", 21, timeout=20)
    ftp.login("antigravity@ekshala.in", "Purvad@1208")
    print("✓ FTP login successful!")

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
                    print(f"  📁 Created FTP dir: {current}")
                except Exception:
                    pass

    for local_path, remote_path in files_to_upload:
        if not os.path.exists(local_path):
            print(f"⚠️ Skip missing local file: {local_path}")
            continue
        
        remote_parent = "/".join(remote_path.split('/')[:-1])
        ensure_ftp_dir(remote_parent)

        
        sz = os.path.getsize(local_path)
        print(f"Uploading {os.path.basename(local_path)} -> {remote_path} ({sz:,} bytes)...")
        with open(local_path, "rb") as f:
            ftp.storbinary(f"STOR /{remote_path.lstrip('/')}", f)
        print(f"  ✓ Uploaded {remote_path}")


    ftp.quit()
    print("🎉 FTP DEPLOYMENT COMPLETE!")

def deploy_via_sftp():
    print("\n--- Trying SFTP Deployment (ekshala_1) ---")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect("190.92.174.187", port=22, username="ekshala_1", password="_C:'uNdX9QLbMlw_", timeout=20)
    sftp = ssh.open_sftp()
    print("✓ SFTP login successful!")

    def ensure_sftp_dir(remote_dir):
        dirs = [d for d in remote_dir.split('/') if d]
        current = ""
        for d in dirs:
            current += "/" + d
            try:
                sftp.stat(current)
            except IOError:
                try:
                    sftp.mkdir(current)
                    print(f"  📁 Created SFTP dir: {current}")
                except Exception:
                    pass

    for local_path, remote_path in files_to_upload:
        if not os.path.exists(local_path):
            continue
        remote_parent = "/".join(remote_path.split('/')[:-1])
        ensure_sftp_dir(remote_parent)
        sz = os.path.getsize(local_path)
        print(f"Uploading {os.path.basename(local_path)} -> {remote_path} ({sz:,} bytes)...")
        sftp.put(local_path, remote_path)
        print(f"  ✓ Uploaded {remote_path}")

    sftp.close()
    ssh.close()
    print("🎉 SFTP DEPLOYMENT COMPLETE!")

try:
    deploy_via_ftp()
except Exception as e:
    print(f"❌ FTP failed ({e}), switching to SFTP...")
    deploy_via_sftp()
