"""
End-to-End Integration Test for KrishiSetu AI (Phase 3 Farmer Journey)
"""
import urllib.request
import json

BASE_URL = "http://localhost:8000/api/v1"

def api_post(endpoint, data):
    req = urllib.request.Request(
        f"{BASE_URL}{endpoint}",
        data=json.dumps(data).encode('utf-8'),
        headers={'Content-Type': 'application/json'},
        method='POST'
    )
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read().decode('utf-8'))

def api_patch(endpoint, data):
    req = urllib.request.Request(
        f"{BASE_URL}{endpoint}",
        data=json.dumps(data).encode('utf-8'),
        headers={'Content-Type': 'application/json'},
        method='PATCH'
    )
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read().decode('utf-8'))

def api_get(endpoint):
    with urllib.request.urlopen(f"{BASE_URL}{endpoint}") as response:
        return json.loads(response.read().decode('utf-8'))

def test_full_journey():
    print("=" * 60)
    print("STEP 1: Farmer checks AI Recommendation for Tomato (500 kg)")
    rec = api_post("/recommendations/", {
        "crop_name": "Tomato",
        "quantity_kg": 500,
        "quality_grade": "Grade A (Export/Premium)"
    })
    print(f" -> Top Recommendation: {rec['recommended_destination_name']}")
    print(f" -> Expected Gross Price: Rs.{rec['expected_price']}/kg")
    print(f" -> Estimated Transport: Rs.{rec['estimated_transport_per_kg']}/kg (Total: Rs.{rec['estimated_transport_cost']})")
    print(f" -> Estimated Net Realization: Rs.{rec['estimated_net_realization_per_kg']}/kg (Total: Rs.{rec['estimated_net_realization']})")
    print(f" -> Selling Window: {rec['recommended_selling_window']}")
    print(f" -> Confidence: {rec['confidence_score']}%")
    assert float(rec['estimated_net_realization']) == 11250.0, f"Expected 11250.0, got {rec['estimated_net_realization']}"

    print("\n" + "=" * 60)
    print("STEP 2: Farmer views Market & Buyer Comparison Matrix")
    res = api_get("/markets/compare/?crop=Tomato&quantity_kg=500")
    matrix = res['comparisons']
    print(f" -> Evaluated {len(matrix)} market and institutional buyer destinations:")
    for opt in matrix[:4]:
        print(f"    - {opt['destination_name']} ({opt['destination_type']}): Gross Rs.{opt['gross_price_per_kg']}/kg | Transport Rs.{opt['transport_cost_per_kg']}/kg | Net Rs.{opt['net_realization_per_kg']}/kg")
    assert matrix[0]['net_realization_per_kg'] >= matrix[1]['net_realization_per_kg']

    print("\n" + "=" * 60)
    print("STEP 2B: Verifying Historical Prices, Trend & Forecast APIs")
    hist = api_get("/markets/prices/history/?crop=Tomato&days=30")
    print(f" -> Historical Price Series: {hist['count']} days fetched for {hist['crop_name']} ({hist['market_name']})")
    assert hist['count'] >= 30

    trend = api_get("/markets/prices/trend/?crop=Tomato&days=30")
    print(f" -> Trend Metrics: Direction: {trend['trend_direction']} | 30D Change: +{trend['percentage_change']}% | Momentum: {trend['momentum']} | Range: Rs.{trend['min_price']} - Rs.{trend['max_price']}")
    assert trend['is_sufficient_data'] is True

    fc = api_get("/markets/prices/forecast/?crop=Tomato&days=7")
    print(f" -> Prototype Forecast: Horizon: {fc['forecast_horizon_days']}D | Peak Day: {fc['peak_selling_day']} (Rs.{fc['peak_expected_price']}/kg) | Confidence: {fc['forecast_confidence_score']}%")
    print(f" -> Forecast Model: {fc['model_type']}")
    assert len(fc['forecast_points']) == 7

    print("\n" + "=" * 60)
    print("STEP 3: Farmer lists Digital Lot for Harvest")
    lot = api_post("/lots/", {
        "crop_name": "Tomato",
        "variety": "Abhinav Hybrid Red",
        "quantity": 500.0,
        "harvest_date": "2026-08-23",
        "asking_price": 24.0,
        "quality_grade": "GRADE_A",
        "location": "Farm Gate, Dindori (Nashik)",
        "description": "Uniform red tomatoes, crated and ready for pickup."
    })
    print(f" -> Digital Lot Created: ID #{lot['id']} | Lot No: {lot['lot_number']} | Status: {lot['status']}")
    assert lot['status'] == "PUBLISHED"

    print("\n" + "=" * 60)
    print("STEP 4: Buyer A submits proposal on Lot")
    # Fetch first buyer
    buyers = api_get("/buyers/")
    buyer_id = buyers['results'][0]['id'] if 'results' in buyers else buyers[0]['id']
    offer = api_post("/lots/offers/", {
        "lot": lot['id'],
        "buyer": buyer_id,
        "offered_price": 24.0,
        "quantity": 500.0,
        "estimated_transport_per_kg": 1.50,
        "message": "Pickup ready tomorrow morning via Tata Ace.",
        "pickup_offered": True
    })
    print(f" -> Offer Received: ID #{offer['id']} | Offered: Rs.{offer['offered_price']}/kg for {offer['quantity']}kg | Status: {offer['status']}")

    print("\n" + "=" * 60)
    print("STEP 5: Farmer Accepts Buyer Offer (Deal Locking & Escrow Trigger)")
    accepted = api_patch(f"/lots/offers/{offer['id']}/", {"action": "accept"})
    print(f" -> Offer Status: {accepted['status']}")
    assert accepted['status'] == "ACCEPTED"

    # Verify Lot Status mutated to DEAL_LOCKED
    updated_lot = api_get(f"/lots/{lot['id']}/")
    print(f" -> Lot Status: {updated_lot['status']}")
    assert updated_lot['status'] == "DEAL_LOCKED"

    print("\n" + "=" * 60)
    print("STEP 6: Verifying Generated Transaction & Strict Net Realization Formula")
    txns = api_get("/transactions/")
    latest_txn = txns['results'][0] if 'results' in txns else txns[0]
    print(f" -> Transaction ID: #{latest_txn['id']}")
    print(f" -> Agreed Price: Rs.{latest_txn['agreed_price']}/kg ({latest_txn['quantity']} kg)")
    print(f" -> Gross Amount: Rs.{latest_txn['gross_amount']}")
    print(f" -> Transport Deductions: Rs.{latest_txn['transport_cost']}")
    print(f" -> Storage Deductions: Rs.{latest_txn['storage_cost']}")
    print(f" -> Other Deductions: Rs.{latest_txn['other_cost']}")
    print(f" -> NET REALIZATION TAKE-HOME: Rs.{latest_txn['net_realization']} (Rs.{latest_txn['net_realization_per_kg']}/kg)")
    print(f" -> Escrow Payment Status: {latest_txn['payment_status']}")
    assert float(latest_txn['gross_amount']) == 12000.0
    assert float(latest_txn['transport_cost']) == 750.0
    assert float(latest_txn['net_realization']) == 11250.0
    assert float(latest_txn['net_realization_per_kg']) == 22.50

    print("\n" + "=" * 60)
    print("STEP 7: Verifying Generated Logistics Record")
    logistics = api_get("/logistics/")
    latest_log = logistics['results'][0] if 'results' in logistics else logistics[0]
    print(f" -> Tracking Number: {latest_log['tracking_number']}")
    print(f" -> Pickup Location: {latest_log['pickup_location']}")
    print(f" -> Destination: {latest_log['destination']}")
    print(f" -> Vehicle Type: {latest_log['vehicle_type']}")
    print(f" -> Freight Cost: Rs.{latest_log['estimated_transport_cost']} (Rs.{latest_log['cost_per_kg']}/kg)")
    print(f" -> Dispatch Status: {latest_log['status']}")

    print("\n" + "=" * 60)
    print(">>> FULL FARMER DEMO JOURNEY VERIFIED SUCCESSFULLY 100% <<<")
    print("=" * 60)

if __name__ == "__main__":
    test_full_journey()
