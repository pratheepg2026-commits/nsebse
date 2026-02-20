from flask import Flask, jsonify
import requests

app = Flask(__name__)

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": "https://www.nseindia.com/companies-listing/corporate-filings-actions",
}

@app.route("/corporate-actions")
def corporate_actions():
    session = requests.Session()
    session.get("https://www.nseindia.com", headers=HEADERS, timeout=15)
    response = session.get(
        "https://www.nseindia.com/api/corporates-corporateActions?index=equities",
        headers=HEADERS,
        timeout=15
    )
    return jsonify(response.json())

if __name__ == "__main__":
    app.run()
