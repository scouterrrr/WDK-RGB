"""
FUNky Buddies NFT - Python Backend Service
Stores FCFS Spot submissions into JSON & CSV, provides view route & Google Sheets export.

To run:
    pip install flask flask-cors
    python app.py
"""

import os
import json
import csv
import time
from datetime import datetime
from flask import Flask, request, jsonify, render_template_string, Response
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

DATA_FILE = os.path.join(os.path.dirname(__file__), 'submissions.json')
CSV_FILE = os.path.join(os.path.dirname(__file__), 'submissions.csv')

def load_entries():
    if not os.path.exists(DATA_FILE):
        # Default sample seed
        initial = [
            {
                "id": "fcfs_demo_1",
                "xHandle": "crypto_whiz",
                "retweetLink": "https://x.com/crypto_whiz/status/2094660203392475362",
                "evmAddress": "0x71C8401301985515713809c97926797a76383321",
                "timestamp": int(time.time() * 1000) - 3600000,
                "status": "verified"
            }
        ]
        save_entries(initial)
        return initial
    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return []

def save_entries(entries):
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(entries, f, indent=2)
    # Also sync CSV for easy Google Drive / Google Sheets import
    with open(CSV_FILE, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(["ID", "X Handle", "Retweet Link", "EVM Wallet Address", "Date Submitted", "Status"])
        for e in entries:
            dt = datetime.fromtimestamp(e.get("timestamp", 0) / 1000).strftime('%Y-%m-%d %H:%M:%S')
            writer.writerow([e.get("id"), e.get("xHandle"), e.get("retweetLink"), e.get("evmAddress"), dt, e.get("status", "pending")])

@app.route('/api/fcfs/submit', methods=['POST'])
def submit_entry():
    data = request.get_json() or {}
    x_handle = (data.get('xHandle') or '').strip().lstrip('@')
    retweet_link = (data.get('retweetLink') or '').strip()
    evm_address = (data.get('evmAddress') or '').strip()

    # Validation rules matching the user request
    if not x_handle or not x_handle.isalnum() and '_' not in x_handle:
        return jsonify({"error": "Invalid X username"}), 400
    if not (retweet_link.startswith('http://') or retweet_link.startswith('https://')) or ('x.com' not in retweet_link and 'twitter.com' not in retweet_link):
        return jsonify({"error": "Must provide a valid x.com/twitter.com retweet link"}), 400
    if not (evm_address.startswith('0x') and len(evm_address) == 42):
        return jsonify({"error": "Must provide a valid 42-character EVM address (0x...)"}), 400

    entries = load_entries()

    # Check duplicates
    for e in entries:
        if e.get('evmAddress', '').lower() == evm_address.lower():
            return jsonify({"error": "This EVM wallet address has already claimed an FCFS spot!"}), 400

    new_entry = {
        "id": f"fcfs_{int(time.time()*1000)}",
        "xHandle": x_handle,
        "retweetLink": retweet_link,
        "evmAddress": evm_address,
        "timestamp": int(time.time() * 1000),
        "status": "pending"
    }
    entries.insert(0, new_entry)
    save_entries(entries)

    return jsonify({"success": True, "message": "FCFS Spot successfully registered!", "entry": new_entry}), 201

@app.route('/api/fcfs/entries', methods=['GET'])
def get_entries():
    return jsonify(load_entries())

@app.route('/api/fcfs/export.csv', methods=['GET'])
def export_csv():
    load_entries()
    if os.path.exists(CSV_FILE):
        with open(CSV_FILE, 'r', encoding='utf-8') as f:
            content = f.read()
        return Response(content, mimetype="text/csv", headers={"Content-Disposition": "attachment;filename=funky_buddies_fcfs.csv"})
    return "No entries yet", 404

@app.route('/view-entries', methods=['GET'])
def view_entries_html():
    entries = load_entries()
    html = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>FUNky Buddies - FCFS Submissions Viewer</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Silkscreen&display=swap" rel="stylesheet">
      <style>
        body { font-family: 'Space Grotesk', sans-serif; background: #141225; color: #F6F2FF; margin: 0; padding: 32px 20px; }
        .wrap { max-width: 1100px; margin: 0 auto; }
        h1 { font-family: 'Silkscreen'; color: #FFD469; margin: 0 0 8px; }
        .meta { color: #c9c2e0; font-size: 14px; margin-bottom: 24px; }
        .actions { display: flex; gap: 12px; margin-bottom: 24px; flex-wrap: wrap; }
        .btn { padding: 10px 18px; border-radius: 999px; text-decoration: none; font-weight: 700; font-size: 13px; display: inline-flex; align-items: center; gap: 8px; border: none; cursor: pointer; }
        .btn-gold { background: #FFD469; color: #141225; }
        .btn-purple { background: #9B87F5; color: #141225; }
        table { width: 100%; border-collapse: collapse; background: #1c1932; border-radius: 12px; overflow: hidden; }
        th { background: #262244; color: #77E0B0; text-align: left; padding: 14px 16px; font-size: 12px; text-transform: uppercase; font-family: 'Silkscreen'; }
        td { padding: 14px 16px; border-bottom: 1px solid #2d2752; font-size: 13.5px; }
        tr:hover td { background: #231f40; }
        a { color: #7EC8F0; text-decoration: none; font-weight: 600; }
        a:hover { text-decoration: underline; }
        .badge { background: #0c3a28; color: #77E0B0; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; }
        .empty { padding: 48px; text-align: center; color: #c9c2e0; }
      </style>
    </head>
    <body>
      <div class="wrap">
        <h1>FUNky Buddies &bull; FCFS Entries</h1>
        <div class="meta">Total registered entries: <strong>{{ entries|length }}</strong> / 1,999 Total Supply on Robinhood Chain</div>
        <div class="actions">
          <a href="/api/fcfs/export.csv" class="btn btn-gold">Download CSV for Google Drive</a>
          <button onclick="copySheetsFormat()" class="btn btn-purple">Copy Google Sheets Format</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>X Handle</th>
              <th>Retweet Task Link</th>
              <th>EVM Wallet Address</th>
              <th>Submitted</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {% for e in entries %}
            <tr>
              <td>{{ loop.index }}</td>
              <td><a href="https://x.com/{{ e.xHandle }}" target="_blank">@{{ e.xHandle }}</a></td>
              <td><a href="{{ e.retweetLink }}" target="_blank">View Tweet</a></td>
              <td><code>{{ e.evmAddress }}</code></td>
              <td>{{ e.timestamp | string }}</td>
              <td><span class="badge">{{ e.status | upper }}</span></td>
            </tr>
            {% else %}
            <tr><td colspan="6" class="empty">No FCFS entries submitted yet.</td></tr>
            {% endfor %}
          </tbody>
        </table>
      </div>
      <script>
        function copySheetsFormat() {
          let rows = "X Handle\\tRetweet Link\\tEVM Address\\tDate\\n";
          let trs = document.querySelectorAll("tbody tr");
          trs.forEach(tr => {
            let tds = tr.querySelectorAll("td");
            if (tds.length >= 5) {
              rows += tds[1].innerText.trim() + "\\t" + tds[2].querySelector("a").href + "\\t" + tds[3].innerText.trim() + "\\t" + tds[4].innerText.trim() + "\\n";
            }
          });
          navigator.clipboard.writeText(rows).then(() => alert("Copied in TSV format! Paste directly into Google Sheets."));
        }
      </script>
    </body>
    </html>
    """
    return render_template_string(html, entries=entries)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"Starting FUNky Buddies Backend on port {port}")
    app.run(host='0.0.0.0', port=port, debug=True)
