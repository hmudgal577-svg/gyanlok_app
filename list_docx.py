import os
import glob
import json
import mammoth
import docx

data_dir = 'D:/data'
print("Files in D:/data:")
for item in os.listdir(data_dir):
    full_path = os.path.join(data_dir, item)
    if os.path.isdir(full_path):
        print("FOLDER:", item)
        for f in os.listdir(full_path):
            print("  -", f)

