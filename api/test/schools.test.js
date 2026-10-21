import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import { schoolBranchSchema } from '../src/modules/schools/school.validation.js';

describe('schools API', () => {
  it('requires authentication for current-school lookup', async () => {
    const response = await request(createApp()).get('/api/v1/schools/current');

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe('UNAUTHORIZED');
  });

  it('requires authentication for school administration', async () => {
    const response = await request(createApp()).get('/api/v1/schools');

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe('UNAUTHORIZED');
  });

  it('validates branch details for multi-branch school records', () => {
    const result = schoolBranchSchema.safeParse({
      name: 'North Campus',
      county: 'Nairobi',
      subCounty: 'Westlands',
      ward: 'Parklands',
      area: 'Highridge',
    });

    expect(result.success).toBe(true);
    expect(result.data.latitude).toBe('');
    expect(result.data.nearestLandmark).toBe('');
  });

  it('requires authentication for branch listing and creation', async () => {
    const app = createApp();
    const schoolId = 'c6e0288a-1395-5bd4-9dfd-d7c24508f550';
    const [listing, adding] = await Promise.all([
      request(app).get(`/api/v1/schools/${schoolId}/branches`),
      request(app).post(`/api/v1/schools/${schoolId}/branches`).send({}),
    ]);

    expect(listing.status).toBe(401);
    expect(adding.status).toBe(401);
  });
});
