const BASE_URL = '/api';

export async function fetchMerchantProfile() {
  const res = await fetch(`${BASE_URL}/merchant/profile`);
  if (!res.ok) throw new Error('Failed to fetch merchant profile');
  return res.json();
}

export async function fetchOverviewAnalytics() {
  const res = await fetch(`${BASE_URL}/analytics/overview`);
  if (!res.ok) throw new Error('Failed to fetch analytics');
  return res.json();
}

export async function fetchDemandPredictions() {
  const res = await fetch(`${BASE_URL}/predictions/demand`);
  if (!res.ok) throw new Error('Failed to fetch demand predictions');
  return res.json();
}

export async function fetchCustomerIntelligence() {
  const res = await fetch(`${BASE_URL}/predictions/customers`);
  if (!res.ok) throw new Error('Failed to fetch customer intelligence');
  return res.json();
}

export async function fetchRecommendations() {
  const res = await fetch(`${BASE_URL}/recommendations`);
  if (!res.ok) throw new Error('Failed to fetch recommendations');
  return res.json();
}

export async function sendCopilotMessage(message, language = 'hinglish') {
  const res = await fetch(`${BASE_URL}/copilot/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, language })
  });
  if (!res.ok) throw new Error('Failed to send message to copilot');
  return res.json();
}

export async function fetchCopilotHistory() {
  const res = await fetch(`${BASE_URL}/copilot/history`);
  if (!res.ok) throw new Error('Failed to fetch copilot history');
  return res.json();
}

export async function fetchActions() {
  const res = await fetch(`${BASE_URL}/actions`);
  if (!res.ok) throw new Error('Failed to fetch actions');
  return res.json();
}

export async function executeAction(payload) {
  const res = await fetch(`${BASE_URL}/actions/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to execute action');
  return res.json();
}

export async function verifyAction(actionId) {
  const res = await fetch(`${BASE_URL}/actions/verify/${actionId}`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Failed to verify action');
  return res.json();
}

export async function triggerSoundboxSound(payload) {
  const res = await fetch(`${BASE_URL}/soundbox/trigger-sound`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to trigger soundbox sound');
  return res.json();
}
