#!/usr/bin/env python3
"""Set a plain-text GitHub secret (non-encrypted — just stored as-is)."""
import os, sys, json, urllib.request

repo = "raybotscode/ascii-canvas"
secret_name = "WRANGLER_CONFIG"

# Read base64 from stdin
b64_value = sys.stdin.read().strip()

# Get GitHub token
gh_token = os.environ.get("GH_TOKEN") or os.environ.get("GITHUB_TOKEN")
if not gh_token:
    # Try gh auth
    import subprocess
    result = subprocess.run(["gh", "auth", "token"], capture_output=True, text=True, timeout=10)
    gh_token = result.stdout.strip()

if not gh_token:
    print("ERROR: No GitHub token available")
    sys.exit(1)

# GitHub API URL
url = f"https://api.github.com/repos/{repo}/actions/secrets/{secret_name}"

# GH CLI approach is simpler
os.execvp("gh", ["gh", "secret", "set", secret_name, "--repo", repo, "--body", b64_value])
