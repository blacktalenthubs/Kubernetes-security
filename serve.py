#!/usr/bin/env python3
"""
Depth Library — tiny zero-dependency local server.

Usage:
    python3 serve.py            # serves on http://localhost:8000
    python3 serve.py 8080       # custom port

Everything is static; this just avoids file:// quirks and serves the
vendored JS with correct MIME types. Nothing leaves your machine.
"""
import http.server
import socketserver
import sys
import webbrowser
from functools import partial

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000


class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # No caching, so weekly content edits show up on refresh.
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, fmt, *args):
        pass  # keep the console quiet


def main():
    handler = partial(Handler, directory=".")
    with socketserver.TCPServer(("127.0.0.1", PORT), handler) as httpd:
        url = f"http://localhost:{PORT}"
        print(f"\n  📚  Depth Library running at  {url}")
        print("      Press Ctrl+C to stop.\n")
        try:
            webbrowser.open(url)
        except Exception:
            pass
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n  Stopped.\n")


if __name__ == "__main__":
    main()
