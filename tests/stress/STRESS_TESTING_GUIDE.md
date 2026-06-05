# 🚀 Stress Testing Guide — Ohh My Happiness

This document outlines the strategy for verifying that the platform can handle the **"Holiday Rush" goal: 10,000+ concurrent visitors**.

## 🛠 Recommended Tool: k6 (Grafana)
We recommend using [k6](https://k6.io/) for its developer-friendly JavaScript API and high performance.

### 1. Installation
```bash
# MacOS (Homebrew)
brew install k6
```

### 2. Traffic Scenarios

#### Scenario A: The Holiday Spike (Stress Test)
Simulate 10,000 users hitting the homepage and store simultaneously.
- **Goal**: Find the breaking point of the Supabase database and Next.js server.
- **Duration**: 10 minutes ramp up, 20 minutes plateau.

#### Scenario B: The Checkout Surge (Load Test)
Simulate 500 users completing a checkout flow every minute.
- **Goal**: Verify that the Order API and inventory logic can handle high write volume without deadlocks.

### 3. Example k6 Script (`tests/stress/spike-test.js`)
```javascript
import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 2000 }, // Ramp up to 2k users
    { duration: '5m', target: 10000 }, // Spike to 10k users
    { duration: '2m', target: 0 },     // Ramp down
  ],
};

export default function () {
  const res = http.get('https://ohhmyhappiness.com/store');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'load time < 500ms': (r) => r.timings.duration < 500,
  });
  sleep(1);
}
```

## 📊 Success Criteria
- **99th Percentile (p99)** latency < 1.5 seconds.
- **Error Rate** < 1%.
- **CPU/Memory Usage** on Supabase remains stable below 80%.

## 🛡️ Mitigation Strategies
If the tests fail, implement the following:
1. **Incremental Static Regeneration (ISR)**: Cache product pages for 60 seconds to reduce DB load.
2. **Edge Caching**: Use Vercel Edge Network or Cloudflare to serve the storefront.
3. **Database Indexing**: Ensure `products.slug` and `orders.user_id` are indexed.
