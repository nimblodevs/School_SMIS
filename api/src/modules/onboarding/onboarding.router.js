import { Router } from "express";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import multer from "multer";
import { authenticate } from "../../middlewares/authMiddleware.js";
import { authorizeRoles } from "../../middlewares/roleMiddleware.js";
import { BadRequestError } from "../../shared/errors/AppError.js";
import { OnboardingController } from "./onboarding.controller.js";

const router = Router();

const allowedMimeTypes = {
  logo: new Set(["image/png", "image/jpeg", "image/webp"]),
  registrationCertificate: new Set([
    "application/pdf",
    "image/png",
    "image/jpeg",
  ]),
  fireSafetyCertificate: new Set([
    "application/pdf",
    "image/png",
    "image/jpeg",
  ]),
  publicHealthCertificate: new Set([
    "application/pdf",
    "image/png",
    "image/jpeg",
  ]),
  operatingLicence: new Set(["application/pdf", "image/png", "image/jpeg"]),
  otherSupportingDocument: new Set([
    "application/pdf",
    "image/png",
    "image/jpeg",
  ]),
};

const wizardUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 6,
    fields: 1,
    fieldSize: 1024 * 1024,
  },
  fileFilter(_request, file, callback) {
    if (
      !Object.hasOwn(allowedMimeTypes, file.fieldname) ||
      !allowedMimeTypes[file.fieldname].has(file.mimetype)
    ) {
      callback(
        new BadRequestError(
          "Use a PNG, JPG, WebP logo or PDF, PNG, JPG document.",
        ),
      );
      return;
    }
    callback(null, true);
  },
}).fields([
  { name: "logo", maxCount: 1 },
  { name: "registrationCertificate", maxCount: 1 },
  { name: "fireSafetyCertificate", maxCount: 1 },
  { name: "publicHealthCertificate", maxCount: 1 },
  { name: "operatingLicence", maxCount: 1 },
  { name: "otherSupportingDocument", maxCount: 1 },
]);

function parseWizardUpload(request, response, next) {
  wizardUpload(request, response, (error) => {
    if (!error) {
      next();
      return;
    }
    if (error instanceof multer.MulterError) {
      const message =
        error.code === "LIMIT_FILE_SIZE"
          ? "Uploaded files must be 10 MB or smaller."
          : "The uploaded files do not match the school onboarding form.";
      next(new BadRequestError(message));
      return;
    }
    next(error);
  });
}

// Onboarding creates tenants, so submissions are throttled per account rather than per IP.
const submitLimiter = rateLimit({
  windowMs: 15 * 60_000,
  limit: 10,
  keyGenerator: (req) => req.user?.id ?? ipKeyGenerator(req.ip),
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: "RATE_LIMITED",
      message: "Too many onboarding submissions. Try again in a few minutes.",
    },
  },
});

router.use(authenticate);
router.get(
  "/availability",
  authorizeRoles("ADMIN", "SUPER_ADMIN"),
  OnboardingController.availability,
);
router.get(
  "/school-code",
  authorizeRoles("ADMIN", "SUPER_ADMIN"),
  OnboardingController.schoolCode,
);
router.post(
  "/school",
  authorizeRoles("ADMIN", "SUPER_ADMIN"),
  submitLimiter,
  OnboardingController.submit,
);
router.post(
  "/school/wizard",
  authorizeRoles("ADMIN", "SUPER_ADMIN"),
  submitLimiter,
  parseWizardUpload,
  OnboardingController.submitWizard,
);

export default router;
