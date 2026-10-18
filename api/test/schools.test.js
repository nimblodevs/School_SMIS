import express from 'express';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { schoolDocuments, schools } from '../src/db/schema.js';
import { createSchoolRouter } from '../src/routes/schools.js';

const school = {
  schoolName: 'Example School',
  schoolCode: 'EXAMPLE-1',
  schoolSlug: 'example-school',
  schoolMotto: 'Learning together',
  visionStatement: 'A strong and supportive learning community.',
  missionStatement: 'We provide high quality education for every learner.',
  schoolType: 'standalone',
  schoolLocation: {
    county: 'Nairobi',
    subCounty: 'Westlands',
    ward: 'Parklands',
    area: 'Parklands',
    latitude: '',
    longitude: '',
    nearestLandmark: '',
  },
  branches: [],
  officialPhone: '+254700000000',
  schoolEmail: 'office@example.test',
  website: '',
  headOfficeAddress: '',
  ownerships: [
    {
      ownershipType: 'private',
      schoolAdminName: 'School Admin',
      schoolAdminEmail: 'admin@example.test',
      schoolAdminMobile: '+254711111111',
      alternativeMobile: '',
    },
  ],
};

function createApp(db = {}, storage = {}) {
  const app = express();
  app.use((request, _response, next) => {
    request.auth = { user: { id: '00000000-0000-4000-8000-000000000001' } };
    next();
  });
  app.use(
    '/schools',
    createSchoolRouter({
      db,
      storage,
      logger: { info() {}, error() {} },
    }),
  );
  return app;
}

describe('school onboarding documents', () => {
  it('requires registration and fire safety certificates', async () => {
    const response = await request(createApp())
      .post('/schools')
      .field('school', JSON.stringify(school));

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('REQUIRED_DOCUMENTS_MISSING');
  });

  it('rejects documents whose content is not a supported file type', async () => {
    const response = await request(createApp())
      .post('/schools')
      .field('school', JSON.stringify(school))
      .attach('registrationCertificate', Buffer.from('not a PDF'), 'registration.pdf')
      .attach('fireSafetyCertificate', Buffer.from('not an image or PDF'), 'fire-safety.pdf');

    expect(response.status).toBe(415);
    expect(response.body.error.code).toBe('INVALID_DOCUMENT_TYPE');
  });

  it('stores both required documents with the school profile', async () => {
    const insertedRows = new Map();
    const db = {
      transaction: async (callback) =>
        callback({
          insert(table) {
            return {
              values: async (values) => {
                insertedRows.set(table, Array.isArray(values) ? values : [values]);
              },
            };
          },
        }),
      select: () => ({
        from(table) {
          return {
            where() {
              return {
                limit: async () => insertedRows.get(table) || [],
                orderBy: async () => insertedRows.get(table) || [],
              };
            },
          };
        },
      }),
    };
    const storage = {
      uploadSchoolDocument: async (_schoolId, _file, _extension, documentType) =>
        `school/documents/${documentType}.pdf`,
      getSchoolLogoUrl: async (key) => `https://storage.example.test/${key}`,
      deleteSchoolLogo: async () => {},
    };
    const pdf = Buffer.from('%PDF-1.4\n');
    const response = await request(createApp(db, storage))
      .post('/schools')
      .field('school', JSON.stringify(school))
      .attach('registrationCertificate', pdf, 'registration.pdf')
      .attach('fireSafetyCertificate', pdf, 'fire-safety.pdf');

    expect(response.status).toBe(201);
    expect(insertedRows.get(schoolDocuments)).toHaveLength(2);
    expect(response.body.data.documents).toHaveLength(2);
    expect(response.body.data.documents[0].url).toContain('https://storage.example.test/');
    expect(insertedRows.get(schools)[0].schoolCode).toBe('EXAMPLE-1');
  });
});
