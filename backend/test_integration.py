import httpx
import json

def run_tests():
    fe_client = httpx.Client(base_url='http://localhost:5173', timeout=10.0)
    be_client = httpx.Client(base_url='http://127.0.0.1:8000', timeout=10.0)

    passed = 0
    failed = 0

    def run_case(name, func):
        nonlocal passed, failed
        try:
            func()
            print(f"[PASS] {name}")
            passed += 1
        except Exception as err:
            print(f"[FAIL] {name}: {err}")
            failed += 1

    # 1. Frontend server root
    def t1():
        r = fe_client.get('/')
        assert r.status_code == 200, f"Expected 200, got {r.status_code}"
        assert '<div id="root">' in r.text, "Root element missing"
    run_case("Frontend Serves HTML 200", t1)

    # 2. Frontend Proxy /api/health
    def t2():
        r = fe_client.get('/api/health')
        assert r.status_code == 200, f"Expected 200, got {r.status_code}"
        assert r.json()['status'] == 'online', "Status not online"
    run_case("Frontend Proxy -> /api/health", t2)

    # 3. Direct Backend /api/health
    def t3():
        r = be_client.get('/api/health')
        assert r.status_code == 200, f"Expected 200, got {r.status_code}"
        assert r.json()['database'] == 'connected', "Database not connected"
    run_case("Direct Backend -> /api/health", t3)

    # 4. Merchant Profile via Proxy
    def t4():
        r = fe_client.get('/api/merchant/profile')
        assert r.status_code == 200, f"Expected 200, got {r.status_code}"
        data = r.json()
        assert data['business_name'] == 'Sharma Kirana & Superstore'
        assert data['upi_vpa'] == 'sharmakirana@paytm'
        assert data['soundbox_status'] == 'ONLINE_4G'
    run_case("Merchant Profile Data", t4)

    # 5. Analytics Overview via Proxy
    def t5():
        r = fe_client.get('/api/analytics/overview')
        assert r.status_code == 200, f"Expected 200, got {r.status_code}"
        data = r.json()
        assert data['today']['revenue'] > 0, "Today revenue is 0"
        assert data['today']['orders'] > 0, "Today orders is 0"
        assert data['weekly_comparison']['revenue_change_pct'] < 0, "Expected revenue drop"
        assert len(data['hourly_trends']) == 15, "Expected 15 hourly buckets"
        assert len(data['top_selling_products']) > 0, "Top products missing"
        assert len(data['payment_methods']) > 0, "Payment methods missing"
        assert data['anomaly'] is not None, "Anomaly alert missing"
    run_case("Analytics Overview & Anomaly Alert", t5)

    # 6. Demand Predictions (ML)
    def t6():
        r = fe_client.get('/api/predictions/demand')
        assert r.status_code == 200, f"Expected 200, got {r.status_code}"
        items = r.json()
        assert len(items) == 12, f"Expected 12 items, got {len(items)}"
        assert any(i['stockout_status'] == 'CRITICAL' for i in items)
        for i in items:
            assert len(i['daily_forecast']) == 7, "Forecast length must be 7"
    run_case("Demand Predictions (12 SKUs, 7d ML forecast)", t6)

    # 7. Customer Retention Intelligence
    def t7():
        r = fe_client.get('/api/predictions/customers')
        assert r.status_code == 200, f"Expected 200, got {r.status_code}"
        data = r.json()
        assert data['inactive_count'] == 42, f"Expected 42 inactive, got {data['inactive_count']}"
        assert len(data['inactive_list']) == 15, f"Expected top 15 inactive in table, got {len(data['inactive_list'])}"
        assert data['potential_recovered_revenue'] > 5000, "Potential recovery too low"
    run_case("Customer Intelligence (42 Inactive, Churn Risk)", t7)

    # 8. Copilot Scenario 1: Sales Down
    def t8():
        r = fe_client.post('/api/copilot/chat', json={
            'message': 'Meri sales pichle week se kam kyun hai?',
            'language': 'hinglish'
        })
        assert r.status_code == 200
        data = r.json()
        assert 'sales' in data['reply'].lower() or 'hafta' in data['reply'].lower() or 'giraavat' in data['reply'].lower()
        assert len(data['suggested_chips']) >= 2
    run_case("Copilot Chat -> Sales Drop Query", t8)

    # 9. Copilot Scenario 2: Solution Proposal
    def t9():
        r = fe_client.post('/api/copilot/chat', json={
            'message': 'Kya karna chahiye?',
            'language': 'hinglish'
        })
        assert r.status_code == 200
        data = r.json()
        card = data.get('action_card')
        assert card is not None, "Action proposal card missing"
        assert card['action_type'] == 'DISCOUNT_CAMPAIGN'
        assert card['coupon_code'] == 'COMEBACK20'
    run_case("Copilot Chat -> Action Proposal Card", t9)

    # 10. Soundbox Voice Trigger
    def t10():
        r = fe_client.post('/api/soundbox/trigger-sound', json={
            'sound_type': 'PAYMENT_RECEIVED',
            'amount': 20.0,
            'text': 'Paytm par bees rupaye prapt hue'
        })
        assert r.status_code == 200
        data = r.json()
        assert data['device_id'] == 'SB4-DEL-98214'
        assert data['sound_type'] == 'PAYMENT_RECEIVED'
    run_case("Paytm Soundbox 4.0 Telemetry & Trigger", t10)

    # 11. Controlled Action Execution
    created_id = None
    def t11():
        nonlocal created_id
        r = fe_client.post('/api/actions/execute', json={
            'action_type': 'DISCOUNT_CAMPAIGN',
            'title': '₹20 Comeback Offer (5-8 PM)',
            'description': 'Targeted discount for 42 inactive repeat customers',
            'target_audience': 'Inactive 14+ Days Customers',
            'payload': {'coupon_code': 'COMEBACK20', 'discount_amount': 20},
            'approved_by': 'Merchant (Ramesh Sharma)'
        })
        assert r.status_code == 200
        res = r.json()
        assert res['success'] == True
        assert res['status'] == 'ACTIVE'
        created_id = res['action_id']
    run_case("Controlled Action Execution (Human Approval)", t11)

    # 12. Action Verification & Revenue Lift
    def t12():
        assert created_id is not None, "No action ID to verify"
        r = fe_client.post(f'/api/actions/verify/{created_id}')
        assert r.status_code == 200
        res = r.json()
        assert res['status'] == 'VERIFIED'
        assert res['revenue_lift'] > 0
        assert res['redemptions_count'] > 0
    run_case("Action Verification & Revenue Lift Telemetry", t12)

    # 13. Demo Reset Endpoint
    def t13():
        r = fe_client.post('/api/demo/reset')
        assert r.status_code == 200
        assert r.json()['success'] == True
    run_case("Demo Reset Endpoint (Instant Pitch Repeatability)", t13)

    print("\n" + "=" * 50)
    print(f"TOTAL TESTS: {passed + failed} | PASSED: {passed} | FAILED: {failed}")
    print("=" * 50)
    if failed > 0:
        raise SystemExit(1)

if __name__ == '__main__':
    run_tests()
