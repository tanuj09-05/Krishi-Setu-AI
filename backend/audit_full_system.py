"""
Comprehensive Final Prototype Audit Script for KrishiSetu AI.
Tests every API endpoint, security isolation boundary, financial calculation, and complete farmer journey.
"""

import urllib.request
import urllib.error
import json
import sys

BASE_URL = "http://localhost:8000/api/v1"

def api_call(endpoint, method="GET", data=None, token=None):
    url = f"{BASE_URL}{endpoint}"
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"

    req_data = json.dumps(data).encode("utf-8") if data is not None else None
    req = urllib.request.Request(url, data=req_data, headers=headers, method=method)

    try:
        with urllib.request.urlopen(req) as response:
            res_body = response.read().decode("utf-8")
            return response.status, json.loads(res_body) if res_body else {}
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8")
        try:
            parsed = json.loads(err_body)
        except Exception:
            parsed = {"error": err_body}
        return e.code, parsed

def run_audit():
    print("=" * 70)
    print("      KRISHISETU AI - COMPREHENSIVE FINAL PROTOTYPE AUDIT      ")
    print("=" * 70)

    audit_results = {
        "passed": [],
        "fixed": [],
        "warnings": []
    }

    # -------------------------------------------------------------
    # 1. AUTHENTICATION & TOKEN LIFECYCLE
    # -------------------------------------------------------------
    print("\n[CHECKPOINT 1] Testing Authentication & JWT Lifecycle...")
    # Farmer Login
    status, res = api_call("/auth/login/", method="POST", data={
        "phone_number": "9823012345",
        "password": "Demo@123"
    })
    assert status == 200 and "access" in res, f"Farmer login failed: {res}"
    farmer_token = res["access"]
    farmer_user_id = res["user"]["id"]
    print(f" -> Farmer Login (Rameshwar Patil): 200 OK | Token: {farmer_token[:20]}...")

    # Buyer Login
    status, res = api_call("/auth/login/", method="POST", data={
        "email": "buyer@demo.krishisetu",
        "password": "Demo@123"
    })
    assert status == 200 and "access" in res, f"Buyer login failed: {res}"
    buyer_token = res["access"]
    print(f" -> Buyer Login (Reliance Hub): 200 OK | Role: {res['user']['role']}")

    # Auth Me Profile
    status, me = api_call("/auth/me/", token=farmer_token)
    assert status == 200 and me["name"] == "Rameshwar Patil"
    print(f" -> /auth/me/ Profile: 200 OK | Farmer: {me['name']} ({me['location']})")
    audit_results["passed"].append("JWT Authentication & /auth/me/ Verified")

    # -------------------------------------------------------------
    # 2. MARKET INTELLIGENCE & PRICE FORECASTING
    # -------------------------------------------------------------
    print("\n[CHECKPOINT 2] Testing Market Intelligence & Price Forecasting APIs...")
    # Historical Prices
    status, hist = api_call("/markets/prices/history/?crop=Tomato&days=30", token=farmer_token)
    assert status == 200 and hist["count"] >= 30, f"History API failed: {hist}"
    print(f" -> Historical Prices (30D): 200 OK | {hist['count']} data points returned")

    # Trend Metrics
    status, trend = api_call("/markets/prices/trend/?crop=Tomato&days=30", token=farmer_token)
    assert status == 200 and trend["is_sufficient_data"] is True
    print(f" -> Trend Metrics: 200 OK | Direction: {trend['trend_direction']} | 30D Change: +{trend['percentage_change']}%")

    # 7-Day Prototype Forecast
    status, fc = api_call("/markets/prices/forecast/?crop=Tomato&days=7", token=farmer_token)
    assert status == 200 and len(fc["forecast_points"]) == 7
    print(f" -> 7-Day Prototype Forecast: 200 OK | Peak: {fc['peak_selling_day']} (Rs.{fc['peak_expected_price']}/kg) | Confidence: {fc['forecast_confidence_score']}%")
    audit_results["passed"].append("Market Intelligence & 7-Day Forecast APIs Verified")

    # -------------------------------------------------------------
    # 3. AI SALE RECOMMENDATION & FINANCIAL FORMULA
    # -------------------------------------------------------------
    print("\n[CHECKPOINT 3] Testing AI Sale Recommendation & Net Realization...")
    status, rec = api_call("/recommendations/", method="POST", data={
        "crop_name": "Tomato",
        "quantity_kg": 500.0,
        "quality_grade": "Grade A (Export/Premium)"
    }, token=farmer_token)
    assert status == 201, f"Recommendation failed: {rec}"
    dest_name = rec["recommended_destination_name"]
    expected_price = float(rec["expected_price"])
    transport_per_kg = float(rec["estimated_transport_per_kg"])
    net_per_kg = float(rec["estimated_net_realization_per_kg"])
    total_net = float(rec["estimated_net_realization"])
    total_transport = float(rec["estimated_transport_cost"])

    print(f" -> Top Destination: {dest_name}")
    print(f" -> Gross Price: Rs.{expected_price:.2f}/kg (Total: Rs.{expected_price * 500:.2f})")
    print(f" -> Transport Freight: Rs.{transport_per_kg:.2f}/kg (Total: Rs.{total_transport:.2f})")
    print(f" -> Estimated Net Realization: Rs.{net_per_kg:.2f}/kg (Total: Rs.{total_net:.2f})")

    # STRICT FINANCIAL FORMULA CHECK:
    # 500kg * 24 = 12000 gross
    # 750 transport
    # 12000 - 750 = 11250 net
    assert abs((expected_price * 500.0) - total_transport - total_net) < 0.01, "Financial formula mismatch in recommendation!"
    print(" -> Strict Net Realization Formula Verified 100% in Backend Engine.")
    audit_results["passed"].append("AI Recommendation & Net Realization Formula Verified")

    # -------------------------------------------------------------
    # 4. DIGITAL LOT CREATION & ISOLATION
    # -------------------------------------------------------------
    print("\n[CHECKPOINT 4] Testing Digital Lot Creation...")
    status, lot = api_call("/lots/", method="POST", data={
        "crop_name": "Tomato",
        "quantity": 500.0,
        "asking_price": 24.0,
        "quality_grade": "GRADE_A",
        "location": "Farm Gate, Dindori",
        "description": "Premium uniform tomatoes for audit testing."
    }, token=farmer_token)
    assert status == 201, f"Lot creation failed: {lot}"
    lot_id = lot["id"]
    lot_no = lot["lot_number"]
    print(f" -> Digital Lot Created: ID #{lot_id} | Lot No: {lot_no} | Status: {lot['status']}")
    audit_results["passed"].append("Digital Lot Creation Verified")

    # -------------------------------------------------------------
    # 5. BUYER OFFER SUBMISSION & ISOLATION
    # -------------------------------------------------------------
    print("\n[CHECKPOINT 5] Testing Buyer Offer Submission...")
    status, offer = api_call("/lots/offers/", method="POST", data={
        "lot": lot_id,
        "offered_price": 24.0,
        "quantity": 500.0,
        "estimated_transport_per_kg": 1.50,
        "pickup_service_offered": True,
        "terms_notes": "Immediate pickup via Tata Ace with T+0 escrow payment."
    }, token=buyer_token)
    assert status == 201, f"Offer creation failed: {offer}"
    offer_id = offer["id"]
    print(f" -> Buyer Offer Placed: ID #{offer_id} | Offered: Rs.{offer['offered_price']}/kg | Status: {offer['status']}")
    audit_results["passed"].append("Buyer Offer Submission Verified")

    # -------------------------------------------------------------
    # 6. FARMER ACCEPTS OFFER -> DEAL LOCKING & ESCROW
    # -------------------------------------------------------------
    print("\n[CHECKPOINT 6] Testing Offer Acceptance & Atomic Transaction Generation...")
    status, accepted = api_call(f"/lots/offers/{offer_id}/", method="PATCH", data={
        "action": "accept"
    }, token=farmer_token)
    assert status == 200 and accepted["status"] == "ACCEPTED", f"Offer acceptance failed: {accepted}"
    print(f" -> Offer Status: {accepted['status']} | Lot Locked in Escrow")

    # Verify Lot Status Updated
    status, updated_lot = api_call(f"/lots/{lot_id}/", token=farmer_token)
    assert updated_lot["status"] == "DEAL_LOCKED"
    print(f" -> Lot #{lot_id} Status: {updated_lot['status']}")
    audit_results["passed"].append("Atomic Offer Acceptance & Deal Locking Verified")

    # -------------------------------------------------------------
    # 7. FINANCIAL TRANSACTION VERIFICATION
    # -------------------------------------------------------------
    print("\n[CHECKPOINT 7] Testing Transaction & Server-Side Escrow Records...")
    status, txns_data = api_call("/transactions/", token=farmer_token)
    txns = txns_data.get("results", txns_data) if isinstance(txns_data, dict) else txns_data
    assert status == 200 and len(txns) > 0, f"No transactions found: {txns_data}"
    latest_txn = txns[0]
    print(f" -> Latest Transaction ID: #{latest_txn['id']}")
    print(f" -> Gross Deal Amount: Rs.{latest_txn['gross_amount']}")
    print(f" -> Transport Deductions: -Rs.{latest_txn['transport_cost']}")
    print(f" -> Net Realization Take-Home: Rs.{latest_txn['net_realization']}")
    print(f" -> Escrow Payment Status: {latest_txn['payment_status']}")

    # Strict server-side formula assert:
    assert float(latest_txn['gross_amount']) == 12000.0
    assert float(latest_txn['transport_cost']) == 750.0
    assert float(latest_txn['net_realization']) == 11250.0
    print(" -> Strict Financial Integrity Check: 500kg x Rs.24 - Rs.750 = Rs.11,250 Net TAKE-HOME PASSED.")
    audit_results["passed"].append("Server-Side Transaction & Escrow Calculation Verified")

    # -------------------------------------------------------------
    # 8. LOGISTICS TRACKING VERIFICATION
    # -------------------------------------------------------------
    print("\n[CHECKPOINT 8] Testing Logistics Fleet Booking...")
    status, logs_data = api_call("/logistics/", token=farmer_token)
    logs = logs_data.get("results", logs_data) if isinstance(logs_data, dict) else logs_data
    assert status == 200 and len(logs) > 0
    latest_log = logs[0]
    print(f" -> Logistics Tracking No: {latest_log['tracking_number']}")
    print(f" -> Assigned Carrier: {latest_log['vehicle_type']} ({latest_log['vehicle_number']})")
    print(f" -> Driver: {latest_log['driver_name']} ({latest_log['driver_phone']})")
    print(f" -> Total Freight: Rs.{latest_log['estimated_transport_cost']}")
    print(f" -> Status: {latest_log['status']}")
    audit_results["passed"].append("Logistics Booking & Fleet Assignment Verified")

    # -------------------------------------------------------------
    # 9. SECURITY & DATA ISOLATION BOUNDARY TESTS
    # -------------------------------------------------------------
    print("\n[CHECKPOINT 9] Testing Security Boundaries & Object-Level Isolation...")
    # Attempt unauthenticated access to private /auth/me/
    status, res = api_call("/auth/me/")
    assert status in [401, 403], f"Unauthenticated access should be blocked, got: {status}"
    print(f" -> Unauthenticated /auth/me/ correctly blocked: HTTP {status}")

    # Register/Login as a second farmer (Farmer B)
    status, reg_b = api_call("/auth/register/", method="POST", data={
        "phone_number": "9823077777",
        "name": "Farmer B (Suresh Shinde)",
        "role": "FARMER",
        "password": "Demo@123"
    })
    if status == 201:
        farmer_b_token = reg_b["access"]
    else:
        status, login_b = api_call("/auth/login/", method="POST", data={
            "phone_number": "9823077777",
            "password": "Demo@123"
        })
        farmer_b_token = login_b["access"]

    # Security Test: Farmer B trying to modify Farmer A's lot
    status, patch_res = api_call(f"/lots/{lot_id}/", method="PATCH", data={
        "asking_price": 40.0
    }, token=farmer_b_token)
    assert status in [403, 404], f"Cross-user lot modification should be forbidden, got: {status}"
    print(f" -> Farmer B unauthorized lot modification correctly blocked: HTTP {status}")

    # Security Test: Farmer B trying to view Farmer A's private transaction
    status, txn_res = api_call(f"/transactions/{latest_txn['id']}/", token=farmer_b_token)
    assert status in [403, 404], f"Cross-user private transaction access should be forbidden, got: {status}"
    print(f" -> Farmer B unauthorized private transaction access correctly blocked: HTTP {status}")
    audit_results["passed"].append("Object-Level Isolation & Privacy Boundaries Verified")

    print("\n" + "=" * 70)
    print(">>> FINAL AUDIT PASSED 100% - ALL 9 CHECKPOINTS VERIFIED <<<")
    print("=" * 70)

if __name__ == "__main__":
    run_audit()
