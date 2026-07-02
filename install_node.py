import os
import sys
import urllib.request
import tarfile
import subprocess

NODE_VERSION = "v20.12.2"
ARCH = "linux-x64"
TAR_FILE = f"node-{NODE_VERSION}-{ARCH}.tar.xz"
URL = f"https://nodejs.org/dist/{NODE_VERSION}/{TAR_FILE}"
DEST_DIR = "/home/abhishek-yadav/pyq/node-bin"

def download_node():
    print(f"Downloading Node.js {NODE_VERSION} from {URL}...")
    if not os.path.exists(DEST_DIR):
        os.makedirs(DEST_DIR)
    
    tar_path = os.path.join(DEST_DIR, TAR_FILE)
    if not os.path.exists(tar_path):
        urllib.request.urlretrieve(URL, tar_path)
        print("Download complete.")
    else:
        print("Archive already downloaded.")
    
    return tar_path

def extract_node(tar_path):
    print("Extracting Node.js archive...")
    # Since tarfile might not support xz extraction out of the box in some python installs 
    # without lzma, we will try to use system tar first, and fall back to python's tarfile.
    try:
        subprocess.run(["tar", "-xf", tar_path, "-C", DEST_DIR], check=True)
        print("Extraction complete via system tar.")
    except Exception as e:
        print(f"System tar failed ({e}), trying python tarfile...")
        with tarfile.open(tar_path, "r:xz") as tar:
            tar.extractall(path=DEST_DIR)
        print("Extraction complete via python tarfile.")

def verify_node():
    node_path = os.path.join(DEST_DIR, f"node-{NODE_VERSION}-{ARCH}", "bin", "node")
    npm_path = os.path.join(DEST_DIR, f"node-{NODE_VERSION}-{ARCH}", "bin", "npm")
    
    print(f"Verifying Node.js at {node_path}...")
    try:
        node_ver = subprocess.check_output([node_path, "-v"]).decode().strip()
        npm_ver = subprocess.check_output([node_path, npm_path, "-v"]).decode().strip()
        print(f"Successfully verified Node.js: {node_ver}, npm: {npm_ver}")
        
        # Write environment settings script
        env_sh_content = f"""#!/bin/bash
export PATH="{DEST_DIR}/node-{NODE_VERSION}-{ARCH}/bin:$PATH"
exec "$@"
"""
        env_sh_path = "/home/abhishek-yadav/pyq/run-with-node.sh"
        with open(env_sh_path, "w") as f:
            f.write(env_sh_content)
        os.chmod(env_sh_path, 0o755)
        print(f"Created environment wrapper at {env_sh_path}")
        
    except Exception as e:
        print(f"Verification failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    tar_path = download_node()
    extract_node(tar_path)
    verify_node()
