import { test, before } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import { createApp } from './app.js';
import { StoreService } from './services/store.service.js';
let app;
before(async () => {
    await StoreService.getInstance().initialize();
    app = createApp();
});
test('GET /api/health returns healthy status', async () => {
    const res = await request(app).get('/api/health');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.status, 'healthy');
});
test('GET /api/v1/categories lists service categories', async () => {
    const res = await request(app).get('/api/v1/categories');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
    assert.ok(res.body.data.length >= 10, 'Expected at least 10 categories');
});
test('POST /api/v1/auth/login succeeds with valid customer credentials', async () => {
    const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
        email: 'customer@fixnear.dev',
        password: 'FixNear@123',
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.accessToken);
    assert.strictEqual(res.body.data.user.role, 'CUSTOMER');
});
test('POST /api/v1/auth/login fails with invalid password', async () => {
    const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
        email: 'customer@fixnear.dev',
        password: 'WrongPassword999!',
    });
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.success, false);
});
test('GET /api/v1/search/providers returns nearby providers with distance & ranking', async () => {
    const res = await request(app)
        .get('/api/v1/search/providers')
        .query({
        city: 'Chennai',
        latitude: 13.0850,
        longitude: 80.2100,
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
    assert.ok(res.body.data.length > 0);
    const first = res.body.data[0];
    assert.ok(typeof first.distanceKm === 'number');
    assert.ok(typeof first.rankingScore === 'number');
    assert.ok(first.businessName);
});
test('Booking state machine prevents invalid transitions', async () => {
    const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'provider@fixnear.dev', password: 'FixNear@123' });
    const token = loginRes.body.data.accessToken;
    // Attempt invalid jump from PENDING directly to COMPLETED
    const res = await request(app)
        .patch('/api/v1/bookings/bk-demo-pending/status')
        .set('Authorization', `Bearer ${token}`)
        .send({
        status: 'COMPLETED',
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
});
test('Reviews cannot be submitted on incomplete bookings', async () => {
    const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'customer@fixnear.dev', password: 'FixNear@123' });
    const token = loginRes.body.data.accessToken;
    // Try reviewing active confirmed booking
    const res = await request(app)
        .post('/api/v1/reviews/bk-demo-active-1')
        .set('Authorization', `Bearer ${token}`)
        .send({
        rating: 5,
        comment: 'Reviewing too early',
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
});
//# sourceMappingURL=api.test.js.map