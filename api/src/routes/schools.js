import { Router } from 'express';
import { and, asc, count, desc, eq, ilike, inArray, or, sql } from 'drizzle-orm';
import { fileTypeFromBuffer } from 'file-type';
import multer from 'multer';
import PDFDocument from 'pdfkit';
import { v7 as uuidv7 } from 'uuid';
import {
  schoolBranches,
  schoolDocuments,
  schoolOwnerships,
  schoolUserMemberships,
  schools,
} from '../db/schema.js';
import {
  addBranchSchema,
  createSchoolSchema,
  sanitizeSchoolData,
  updateSchoolSchema,
} from '../validation/schools.js';

const logoMimeExtensions = new Map([
  ['image/png', 'png'],
  ['image/jpeg', 'jpg'],
  ['image/webp', 'webp'],
]);

const documentMimeExtensions = new Map([
  ['application/pdf', 'pdf'],
  ['image/png', 'png'],
  ['image/jpeg', 'jpg'],
]);

const uploadLogo = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024, files: 1 },
}).single('logo');
const uploadOnboardingDocuments = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 5 },
}).fields([
  { name: 'registrationCertificate', maxCount: 1 },
  { name: 'fireSafetyCertificate', maxCount: 1 },
  { name: 'publicHealthCertificate', maxCount: 1 },
  { name: 'operatingLicence', maxCount: 1 },
  { name: 'otherSupportingDocument', maxCount: 1 },
]);

const documentLabels = {
  registrationCertificate: 'School registration certificate',
  fireSafetyCertificate: 'Fire safety certificate',
  publicHealthCertificate: 'Public health certificate',
  operatingLicence: 'Operating licence',
  otherSupportingDocument: 'Other supporting document',
};

function asyncRoute(handler) {
  return (request, response, next) => Promise.resolve(handler(request, response, next)).catch(next);
}

function sendValidationError(response, parsed) {
  return response.status(400).json({
    error: {
      code: 'VALIDATION_ERROR',
      message: 'The request contains invalid school data.',
      details: parsed.error.issues.map(({ path, message }) => ({ path, message })),
    },
  });
}

function validSchoolId(request, response) {
  const parsed = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    request.params.schoolId,
  );
  if (!parsed) {
    response.status(400).json({
      error: { code: 'INVALID_SCHOOL_ID', message: 'School id must be a UUID.' },
    });
    return false;
  }
  return true;
}

function toLocation(row) {
  return {
    name: row.name,
    county: row.county,
    subCounty: row.subCounty,
    ward: row.ward,
    area: row.area,
    latitude: row.latitude,
    longitude: row.longitude,
    nearestLandmark: row.nearestLandmark,
  };
}

function toOwnership(row) {
  return {
    ownershipType: row.ownershipType,
    schoolAdminName: row.schoolAdminName,
    schoolAdminEmail: row.schoolAdminEmail,
    schoolAdminMobile: row.schoolAdminMobile,
    alternativeMobile: row.alternativeMobile,
  };
}

async function loadSchoolDetails(db, schoolRows, storage, { includeDocuments = false } = {}) {
  if (schoolRows.length === 0) return [];
  const ids = schoolRows.map((school) => school.id);
  const [branchRows, ownershipRows] = await Promise.all([
    db.select().from(schoolBranches).where(inArray(schoolBranches.schoolId, ids)).orderBy(asc(schoolBranches.createdAt)),
    db.select().from(schoolOwnerships).where(inArray(schoolOwnerships.schoolId, ids)).orderBy(desc(schoolOwnerships.isPrimary), asc(schoolOwnerships.createdAt)),
  ]);
  const documentRows = includeDocuments
    ? await db
      .select()
      .from(schoolDocuments)
      .where(inArray(schoolDocuments.schoolId, ids))
      .orderBy(asc(schoolDocuments.createdAt))
    : [];
  const branchesBySchool = new Map(ids.map((id) => [id, []]));
  const ownershipsBySchool = new Map(ids.map((id) => [id, []]));
  const documentsBySchool = new Map(ids.map((id) => [id, []]));
  branchRows.forEach((branch) => branchesBySchool.get(branch.schoolId)?.push(toLocation(branch)));
  ownershipRows.forEach((ownership) => ownershipsBySchool.get(ownership.schoolId)?.push(toOwnership(ownership)));
  documentRows.forEach((document) => documentsBySchool.get(document.schoolId)?.push(document));

  return Promise.all(
    schoolRows.map(async (school) => {
      const ownerships = ownershipsBySchool.get(school.id) || [];
      const branches = branchesBySchool.get(school.id) || [];
      const documents = documentsBySchool.get(school.id) || [];
      const primaryOwnership = ownerships[0];
      let logoUrl = null;
      if (school.logoObjectKey) {
        try {
          logoUrl = await storage.getSchoolLogoUrl(school.logoObjectKey);
        } catch (error) {
          error.message = `Unable to create a logo download URL: ${error.message}`;
          throw error;
        }
      }
      const schoolDocumentsResponse = includeDocuments
        ? await Promise.all(
          documents.map(async (document) => ({
          id: document.id,
          documentType: document.documentType,
          label: documentLabels[document.documentType] || 'Supporting document',
          originalName: document.originalName,
          contentType: document.contentType,
          url: await storage.getSchoolLogoUrl(document.objectKey),
          createdAt: document.createdAt,
          })),
        )
        : undefined;

      return {
        id: school.id,
        schoolName: school.schoolName,
        schoolCode: school.schoolCode,
        schoolSlug: school.schoolSlug,
        schoolMotto: school.schoolMotto,
        visionStatement: school.visionStatement,
        missionStatement: school.missionStatement,
        schoolType: school.schoolType,
        schoolLocation: school.schoolLocation,
        branches,
        officialPhone: school.officialPhone,
        schoolEmail: school.schoolEmail,
        website: school.website,
        headOfficeAddress: school.headOfficeAddress,
        logoUrl,
        ...(schoolDocumentsResponse ? { documents: schoolDocumentsResponse } : {}),
        ownerships,
        primaryAdmin: primaryOwnership
          ? {
              name: primaryOwnership.schoolAdminName,
              email: primaryOwnership.schoolAdminEmail,
              mobile: primaryOwnership.schoolAdminMobile,
              alternativeMobile: primaryOwnership.alternativeMobile,
            }
          : null,
        createdAt: school.createdAt,
        updatedAt: school.updatedAt,
      };
    }),
  );
}

async function getSchool(db, schoolId, storage) {
  const [school] = await db.select().from(schools).where(eq(schools.id, schoolId)).limit(1);
  if (!school) return null;
  const [result] = await loadSchoolDetails(db, [school], storage, { includeDocuments: true });
  return result;
}

function schoolInsertValues(data, schoolId) {
  return {
    id: schoolId,
    schoolName: data.schoolName,
    schoolCode: data.schoolCode.toUpperCase(),
    schoolSlug: data.schoolSlug,
    schoolMotto: data.schoolMotto,
    visionStatement: data.visionStatement,
    missionStatement: data.missionStatement,
    schoolType: data.schoolType,
    schoolLocation: data.schoolType === 'standalone' ? data.schoolLocation : null,
    officialPhone: data.officialPhone,
    schoolEmail: data.schoolEmail,
    website: data.website,
    headOfficeAddress: data.headOfficeAddress,
    updatedAt: new Date(),
  };
}

function branchInsertValues(branch, schoolId) {
  return {
    id: uuidv7(),
    schoolId,
    name: branch.name,
    county: branch.county,
    subCounty: branch.subCounty,
    ward: branch.ward,
    area: branch.area,
    latitude: branch.latitude,
    longitude: branch.longitude,
    nearestLandmark: branch.nearestLandmark,
  };
}

function ownershipInsertValues(ownership, schoolId, index) {
  return {
    id: uuidv7(),
    schoolId,
    ownershipType: ownership.ownershipType,
    schoolAdminName: ownership.schoolAdminName,
    schoolAdminEmail: ownership.schoolAdminEmail.toLowerCase(),
    schoolAdminMobile: ownership.schoolAdminMobile,
    alternativeMobile: ownership.alternativeMobile,
    isPrimary: index === 0,
  };
}

async function replaceSchoolChildren(transaction, schoolId, data) {
  await transaction.delete(schoolBranches).where(eq(schoolBranches.schoolId, schoolId));
  await transaction.delete(schoolOwnerships).where(eq(schoolOwnerships.schoolId, schoolId));
  if (data.schoolType === 'multi-branch' && data.branches.length) {
    await transaction.insert(schoolBranches).values(
      data.branches.map((branch) => branchInsertValues(branch, schoolId)),
    );
  }
  if (data.ownerships.length) {
    await transaction.insert(schoolOwnerships).values(
      data.ownerships.map((ownership, index) => ownershipInsertValues(ownership, schoolId, index)),
    );
  }
}

function directoryConditions({ search, schoolType, ownershipType }) {
  const conditions = [];
  if (schoolType && schoolType !== 'all') conditions.push(eq(schools.schoolType, schoolType));
  if (ownershipType && ownershipType !== 'all') {
    conditions.push(
      sql`exists (select 1 from ${schoolOwnerships} where ${schoolOwnerships.schoolId} = ${schools.id} and ${schoolOwnerships.ownershipType} = ${ownershipType})`,
    );
  }
  if (search) {
    const term = `%${search}%`;
    conditions.push(
      or(
        ilike(schools.schoolName, term),
        ilike(schools.schoolCode, term),
        ilike(schools.schoolSlug, term),
        ilike(schools.schoolEmail, term),
        sql`exists (select 1 from ${schoolOwnerships} where ${schoolOwnerships.schoolId} = ${schools.id} and (${schoolOwnerships.schoolAdminName} ilike ${term} or ${schoolOwnerships.schoolAdminEmail} ilike ${term} or ${schoolOwnerships.ownershipType} ilike ${term}))`,
        sql`exists (select 1 from ${schoolBranches} where ${schoolBranches.schoolId} = ${schools.id} and (${schoolBranches.name} ilike ${term} or ${schoolBranches.area} ilike ${term} or ${schoolBranches.ward} ilike ${term} or ${schoolBranches.subCounty} ilike ${term} or ${schoolBranches.county} ilike ${term}))`,
        sql`${schools.schoolLocation}::text ilike ${term}`,
      ),
    );
  }
  return conditions.length ? and(...conditions) : undefined;
}

export function createSchoolRouter({ db, storage, logger }) {
  const router = Router();

  /**
   * @openapi
   * /schools:
   *   get:
   *     summary: Search and page through the school directory
   *     parameters:
   *       - in: query
   *         name: page
   *         schema: { type: integer, minimum: 1 }
   *       - in: query
   *         name: pageSize
   *         schema: { type: integer, minimum: 1, maximum: 100 }
   *       - in: query
   *         name: search
   *         schema: { type: string }
   *       - in: query
   *         name: schoolType
   *         schema: { type: string, enum: [all, standalone, multi-branch] }
   *       - in: query
   *         name: ownershipType
   *         schema: { type: string, enum: [all, public, private] }
   *     responses:
   *       200:
   *         description: Paged directory results.
   */
  router.get(
    '/',
    asyncRoute(async (request, response) => {
      const page = Math.max(1, Number.parseInt(request.query.page, 10) || 1);
      const pageSize = Math.min(100, Math.max(1, Number.parseInt(request.query.pageSize, 10) || 10));
      const search = String(request.query.search || '').trim().slice(0, 160);
      const schoolType = ['standalone', 'multi-branch'].includes(request.query.schoolType)
        ? request.query.schoolType
        : '';
      const ownershipType = ['public', 'private'].includes(request.query.ownershipType)
        ? request.query.ownershipType
        : '';
      const sort = request.query.sort === 'desc' ? desc : asc;
      const where = directoryConditions({ search, schoolType, ownershipType });
      const [countRows, schoolRows, totalRows, stats] = await Promise.all([
        db.select({ total: count() }).from(schools).where(where),
        db
          .select()
          .from(schools)
          .where(where)
          .orderBy(sort(schools.schoolName), asc(schools.id))
          .limit(pageSize)
          .offset((page - 1) * pageSize),
        db.select({ total: count() }).from(schools),
        db
          .select({ multiBranch: count() })
          .from(schools)
          .where(eq(schools.schoolType, 'multi-branch')),
      ]);
      const total = Number(countRows[0]?.total || 0);
      const records = await loadSchoolDetails(db, schoolRows, storage);
      const memberRows = await db
        .select({ schoolId: schoolUserMemberships.schoolId })
        .from(schoolUserMemberships)
        .where(eq(schoolUserMemberships.userId, request.auth.user.id));
      const manageableSchools = new Set(memberRows.map(({ schoolId }) => schoolId));
      const directoryRecords = records.map(({ ownerships, ...school }) => ({
        ...school,
        ownerships: ownerships.map(({ ownershipType }) => ({ ownershipType })),
        primaryAdmin: null,
        canManage: manageableSchools.has(school.id),
      }));

      response.json({
        data: directoryRecords,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
        summary: {
          registeredSchools: Number(totalRows[0]?.total || 0),
          multiBranchSchools: Number(stats[0]?.multiBranch || 0),
        },
      });
    }),
  );

  router.use(
    '/:schoolId',
    asyncRoute(async (request, response, next) => {
      if (!validSchoolId(request, response)) return;
      if (!request.auth?.user?.id) {
        response.status(401).json({
          error: { code: 'AUTHENTICATION_REQUIRED', message: 'Sign in to continue.' },
        });
        return;
      }
      const [membership] = await db
        .select({ id: schoolUserMemberships.id })
        .from(schoolUserMemberships)
        .where(and(
          eq(schoolUserMemberships.schoolId, request.params.schoolId),
          eq(schoolUserMemberships.userId, request.auth.user.id),
        ))
        .limit(1);
      if (!membership) {
        response.status(404).json({
          error: { code: 'SCHOOL_NOT_FOUND', message: 'School not found.' },
        });
        return;
      }
      next();
    }),
  );

  /**
   * @openapi
   * /schools:
   *   post:
   *     summary: Create a school profile during onboarding
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             required: [school, registrationCertificate, fireSafetyCertificate]
   *             properties:
   *               school: { type: string, description: JSON-encoded school profile }
   *               registrationCertificate: { type: string, format: binary }
   *               fireSafetyCertificate: { type: string, format: binary }
   *               publicHealthCertificate: { type: string, format: binary }
   *               operatingLicence: { type: string, format: binary }
   *               otherSupportingDocument: { type: string, format: binary }
   *     responses:
   *       201:
   *         description: School created.
   *       400:
   *         description: Invalid school data.
   */
  router.post(
    '/',
    uploadOnboardingDocuments,
    asyncRoute(async (request, response) => {
      let requestData = request.body;
      if (typeof request.body.school === 'string') {
        try {
          requestData = JSON.parse(request.body.school);
        } catch {
          response.status(400).json({
            error: { code: 'INVALID_SCHOOL_JSON', message: 'School profile data must be valid JSON.' },
          });
          return;
        }
      }
      const parsed = createSchoolSchema.safeParse(sanitizeSchoolData(requestData));
      if (!parsed.success) return sendValidationError(response, parsed);

      const files = request.files || {};
      if (!files.registrationCertificate?.[0] || !files.fireSafetyCertificate?.[0]) {
        response.status(400).json({
          error: {
            code: 'REQUIRED_DOCUMENTS_MISSING',
            message: 'School registration and fire safety certificates are required.',
          },
        });
        return;
      }

      const schoolId = uuidv7();
      const data = parsed.data;
      const filesToUpload = [];
      for (const [documentType, documentFiles] of Object.entries(files)) {
        const file = documentFiles[0];
        const detectedType = await fileTypeFromBuffer(file.buffer);
        const extension = detectedType && documentMimeExtensions.get(detectedType.mime);
        if (!detectedType || !extension) {
          response.status(415).json({
            error: {
              code: 'INVALID_DOCUMENT_TYPE',
              message: `${documentLabels[documentType]} must be a valid PDF, PNG, or JPG.`,
            },
          });
          return;
        }
        filesToUpload.push({ documentType, file, extension, mimeType: detectedType.mime });
      }

      const uploadedObjects = [];
      const documentsToSave = [];
      try {
        for (const { documentType, file, extension, mimeType } of filesToUpload) {
          const objectKey = await storage.uploadSchoolDocument(
            schoolId,
            { ...file, mimeType },
            extension,
            documentType,
          );
          uploadedObjects.push(objectKey);
          documentsToSave.push({
            id: uuidv7(),
            schoolId,
            documentType,
            originalName: file.originalname.replace(/[^\w.\- ()]/g, '_').slice(0, 180),
            contentType: mimeType,
            objectKey,
          });
        }
        await db.transaction(async (transaction) => {
          await transaction.insert(schools).values(schoolInsertValues(data, schoolId));
          await transaction.insert(schoolUserMemberships).values({
            id: uuidv7(),
            userId: request.auth.user.id,
            schoolId,
          });
          if (data.schoolType === 'multi-branch') {
            await transaction.insert(schoolBranches).values(
              data.branches.map((branch) => branchInsertValues(branch, schoolId)),
            );
          }
          await transaction.insert(schoolOwnerships).values(
            data.ownerships.map((ownership, index) => ownershipInsertValues(ownership, schoolId, index)),
          );
          await transaction.insert(schoolDocuments).values(documentsToSave);
        });
      } catch (error) {
        const cleanupResults = await Promise.allSettled(
          uploadedObjects.map((objectKey) => storage.deleteSchoolLogo(objectKey)),
        );
        cleanupResults.forEach((result, index) => {
          if (result.status === 'rejected') {
            logger.error(
              { err: result.reason, objectKey: uploadedObjects[index], schoolId },
              'failed to clean up school document after onboarding failure',
            );
          }
        });
        throw error;
      }
      const created = await getSchool(db, schoolId, storage);
      logger.info({ schoolId }, 'school profile and required documents created');
      response.status(201).json({ data: created });
    }),
  );

  router.get(
    '/:schoolId',
    asyncRoute(async (request, response) => {
      if (!validSchoolId(request, response)) return;
      const school = await getSchool(db, request.params.schoolId, storage);
      if (!school) {
        response.status(404).json({ error: { code: 'SCHOOL_NOT_FOUND', message: 'School not found.' } });
        return;
      }
      response.json({ data: school });
    }),
  );

  /**
   * @openapi
   * /schools/{schoolId}:
   *   put:
   *     summary: Update mutable school profile fields
   *     description: School name and code are immutable in this endpoint.
   *     parameters:
   *       - in: path
   *         name: schoolId
   *         required: true
   *         schema: { type: string, format: uuid }
   *     responses:
   *       200:
   *         description: Updated school profile.
   */
  router.put(
    '/:schoolId',
    asyncRoute(async (request, response) => {
      if (!validSchoolId(request, response)) return;
      const parsed = updateSchoolSchema.safeParse(sanitizeSchoolData(request.body));
      if (!parsed.success) return sendValidationError(response, parsed);
      const schoolId = request.params.schoolId;
      const current = await getSchool(db, schoolId, storage);
      if (!current) {
        response.status(404).json({ error: { code: 'SCHOOL_NOT_FOUND', message: 'School not found.' } });
        return;
      }

      const data = parsed.data;
      await db.transaction(async (transaction) => {
        await transaction
          .update(schools)
          .set({
            schoolSlug: data.schoolSlug,
            schoolMotto: data.schoolMotto,
            visionStatement: data.visionStatement,
            missionStatement: data.missionStatement,
            schoolType: data.schoolType,
            schoolLocation: data.schoolType === 'standalone' ? data.schoolLocation : null,
            officialPhone: data.officialPhone,
            schoolEmail: data.schoolEmail,
            website: data.website,
            headOfficeAddress: data.headOfficeAddress,
            updatedAt: new Date(),
          })
          .where(eq(schools.id, schoolId));
        await replaceSchoolChildren(transaction, schoolId, data);
      });
      const updated = await getSchool(db, schoolId, storage);
      logger.info({ schoolId }, 'school profile updated');
      response.json({ data: updated });
    }),
  );

  router.post(
    '/:schoolId/branches',
    asyncRoute(async (request, response) => {
      if (!validSchoolId(request, response)) return;
      const parsed = addBranchSchema.safeParse(sanitizeSchoolData(request.body));
      if (!parsed.success) return sendValidationError(response, parsed);
      const schoolId = request.params.schoolId;
      const current = await getSchool(db, schoolId, storage);
      if (!current) {
        response.status(404).json({ error: { code: 'SCHOOL_NOT_FOUND', message: 'School not found.' } });
        return;
      }

      await db.transaction(async (transaction) => {
        if (current.schoolType === 'standalone') {
          const original = {
            name: current.schoolName,
            ...current.schoolLocation,
          };
          await transaction.insert(schoolBranches).values([
            branchInsertValues(original, schoolId),
            branchInsertValues(parsed.data, schoolId),
          ]);
          await transaction
            .update(schools)
            .set({ schoolType: 'multi-branch', schoolLocation: null, updatedAt: new Date() })
            .where(eq(schools.id, schoolId));
        } else {
          await transaction.insert(schoolBranches).values(branchInsertValues(parsed.data, schoolId));
        }
      });
      const updated = await getSchool(db, schoolId, storage);
      logger.info({ schoolId, branchName: parsed.data.name }, 'school branch added');
      response.status(201).json({ data: updated });
    }),
  );

  router.post(
    '/:schoolId/logo',
    uploadLogo,
    asyncRoute(async (request, response) => {
      if (!validSchoolId(request, response)) return;
      if (!request.file) {
        response.status(400).json({ error: { code: 'LOGO_REQUIRED', message: 'Choose a logo image to upload.' } });
        return;
      }
      const detectedType = await fileTypeFromBuffer(request.file.buffer);
      if (!detectedType || logoMimeExtensions.get(detectedType.mime) !== detectedType.ext) {
        response.status(415).json({ error: { code: 'INVALID_LOGO_TYPE', message: 'Logo must be a valid PNG, JPEG, or WebP image.' } });
        return;
      }

      const schoolId = request.params.schoolId;
      const [current] = await db.select().from(schools).where(eq(schools.id, schoolId)).limit(1);
      if (!current) {
        response.status(404).json({ error: { code: 'SCHOOL_NOT_FOUND', message: 'School not found.' } });
        return;
      }

      const mimeType = detectedType.mime;
      const objectKey = await storage.uploadSchoolLogo(
        schoolId,
        { ...request.file, mimeType },
        logoMimeExtensions.get(mimeType),
      );
      try {
        await db
          .update(schools)
          .set({ logoObjectKey: objectKey, logoContentType: mimeType, updatedAt: new Date() })
          .where(eq(schools.id, schoolId));
      } catch (error) {
        await storage.deleteSchoolLogo(objectKey);
        throw error;
      }
      if (current.logoObjectKey) await storage.deleteSchoolLogo(current.logoObjectKey);
      response.json({ data: await getSchool(db, schoolId, storage) });
    }),
  );

  router.delete(
    '/:schoolId/logo',
    asyncRoute(async (request, response) => {
      if (!validSchoolId(request, response)) return;
      const [current] = await db.select().from(schools).where(eq(schools.id, request.params.schoolId)).limit(1);
      if (!current) {
        response.status(404).json({ error: { code: 'SCHOOL_NOT_FOUND', message: 'School not found.' } });
        return;
      }
      if (current.logoObjectKey) await storage.deleteSchoolLogo(current.logoObjectKey);
      await db
        .update(schools)
        .set({ logoObjectKey: null, logoContentType: null, updatedAt: new Date() })
        .where(eq(schools.id, request.params.schoolId));
      response.json({ data: await getSchool(db, request.params.schoolId, storage) });
    }),
  );

  router.get(
    '/:schoolId/profile.pdf',
    asyncRoute(async (request, response) => {
      if (!validSchoolId(request, response)) return;
      const school = await getSchool(db, request.params.schoolId, storage);
      if (!school) {
        response.status(404).json({ error: { code: 'SCHOOL_NOT_FOUND', message: 'School not found.' } });
        return;
      }

      response.setHeader('Content-Type', 'application/pdf');
      response.setHeader(
        'Content-Disposition',
        `attachment; filename="${school.schoolSlug}-profile.pdf"`,
      );
      const document = new PDFDocument({ margin: 52, size: 'A4' });
      document.on('error', (error) => {
        logger.error({ err: error, schoolId: school.id }, 'school profile PDF generation failed');
        if (!response.headersSent) response.status(500).end();
      });
      document.pipe(response);
      document.fontSize(21).fillColor('#0d2f22').text(school.schoolName);
      document.moveDown(0.25);
      document.fontSize(10).fillColor('#65736c').text(`School code: ${school.schoolCode}`);
      document.text(`School structure: ${school.schoolType}`);
      document.text(`School email: ${school.schoolEmail}`);
      document.text(`Official phone: ${school.officialPhone}`);
      if (school.website) document.text(`Website: ${school.website}`);
      document.moveDown();
      document.fontSize(14).fillColor('#0d2f22').text('School details');
      document.moveDown(0.4);
      document.fontSize(10).fillColor('#202a25');
      document.text(`Motto: ${school.schoolMotto}`);
      document.moveDown(0.3);
      document.text(`Vision: ${school.visionStatement}`);
      document.moveDown(0.3);
      document.text(`Mission: ${school.missionStatement}`);
      document.moveDown();
      document.fontSize(14).fillColor('#0d2f22').text('School locations');
      document.moveDown(0.4);
      const locations = school.schoolType === 'standalone'
        ? [{ name: school.schoolName, ...school.schoolLocation }]
        : school.branches;
      locations.forEach((location) => {
        document.fontSize(10).fillColor('#202a25').text(location.name || school.schoolName);
        document.fontSize(9).fillColor('#65736c').text(
          [location.area, location.ward, location.subCounty, location.county]
            .filter(Boolean)
            .join(', '),
        );
        document.moveDown(0.4);
      });
      if (school.primaryAdmin) {
        document.moveDown();
        document.fontSize(14).fillColor('#0d2f22').text('Primary school admin');
        document.moveDown(0.4);
        document.fontSize(10).fillColor('#202a25').text(school.primaryAdmin.name);
        document.text(school.primaryAdmin.email);
        document.text(school.primaryAdmin.mobile);
      }
      document.end();
    }),
  );

  return router;
}

export function logoUploadErrorHandler(error, request, response, next) {
  if (error instanceof multer.MulterError) {
    const status = error.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
    const isLogoUpload = request.path.endsWith('/logo');
    response.status(status).json({
      error: {
        code: error.code,
        message: error.code === 'LIMIT_FILE_SIZE'
          ? isLogoUpload
            ? 'Logo image must be 2 MB or smaller.'
            : 'Each document must be 10 MB or smaller.'
          : isLogoUpload
            ? 'Upload one logo image at a time.'
            : 'Upload no more than one file for each document type.',
      },
    });
    return;
  }
  next(error);
}
