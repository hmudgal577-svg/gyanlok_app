import os
import sys
import ftplib
import time

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

LOCAL_PUBLIC_DIR = r"C:\Users\hmudg\.gemini\antigravity\scratch\gyanlok\public"
LOCAL_SCRATCH_DIR = r"C:\Users\hmudg\.gemini\antigravity\scratch\gyanlok"

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

def get_ftp_connection():
    ftp = ftplib.FTP()
    ftp.connect("190.92.174.187", 21, timeout=120)
    ftp.login("antigravity@ekshala.in", "Purvad@1208")
    return ftp

def deploy_via_ftp():
    print("\n--- Starting Robust FTP Deployment (antigravity@ekshala.in) ---")
    ftp = get_ftp_connection()
    print("✓ FTP login successful!")

    created_dirs = set()

    def ensure_ftp_dir(remote_dir):
        if remote_dir in created_dirs:
            return
        dirs = [d for d in remote_dir.split('/') if d]
        current = ""
        for d in dirs:
            current += "/" + d
            try:
                ftp.cwd(current)
            except ftplib.error_perm:
                try:
                    ftp.mkd(current)
                except Exception:
                    pass
        created_dirs.add(remote_dir)

    uploaded_count = 0
    skipped_count = 0

    for local_path, remote_path in files_to_upload:
        if not os.path.exists(local_path):
            continue

        remote_clean = "/" + remote_path.lstrip('/')
        remote_parent = "/".join(remote_clean.split('/')[:-1])
        local_sz = os.path.getsize(local_path)

        # Check if file size matches remote file size
        remote_sz = None
        try:
            remote_sz = ftp.size(remote_clean)
        except Exception:
            pass

        if remote_sz is not None and remote_sz == local_sz:
            skipped_count += 1
            continue

        # Upload with retry logic
        for attempt in range(3):
            try:
                ensure_ftp_dir(remote_parent)
                print(f"Uploading {os.path.basename(local_path)} -> {remote_path} ({local_sz:,} bytes)...")
                with open(local_path, "rb") as f:
                    ftp.storbinary(f"STOR {remote_clean}", f)
                print(f"  ✓ Uploaded {remote_path}")
                uploaded_count += 1
                break
            except Exception as err:
                print(f"  ⚠️ Attempt {attempt+1} failed for {remote_path}: {err}. Reconnecting...")
                time.sleep(2)
                try:
                    ftp.quit()
                except Exception:
                    pass
                ftp = get_ftp_connection()

    try:
        ftp.quit()
    except Exception:
        pass
    print(f"\n🎉 FTP DEPLOYMENT COMPLETE! (Uploaded: {uploaded_count}, Skipped matching: {skipped_count})")

if __name__ == "__main__":
    deploy_via_ftp()
