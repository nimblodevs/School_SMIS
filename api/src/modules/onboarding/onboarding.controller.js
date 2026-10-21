import { BadRequestError } from "../../shared/errors/AppError.js";
import { OnboardingService } from "./onboarding.service.js";
import {
  onboardingAvailabilityQuerySchema,
  schoolCodeQuerySchema,
  schoolWizardSchema,
  submitSchoolOnboardingSchema,
} from "./onboarding.validation.js";

export class OnboardingController {
  static async schoolCode(req, res, next) {
    try {
      const validation = schoolCodeQuerySchema.safeParse(req.query);
      if (!validation.success) {
        throw new BadRequestError(
          "Validation error",
          validation.error.format(),
        );
      }
      const schoolCode = await OnboardingService.previewSchoolCode(
        validation.data.name,
        req.user,
      );
      return res.json({ success: true, data: { schoolCode } });
    } catch (error) {
      next(error);
    }
  }

  static async availability(req, res, next) {
    try {
      const validation = onboardingAvailabilityQuerySchema.safeParse(req.query);
      if (!validation.success)
        throw new BadRequestError(
          "Validation error",
          validation.error.format(),
        );
      const data = await OnboardingService.checkAvailability(validation.data);
      return res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async submit(req, res, next) {
    try {
      const validation = submitSchoolOnboardingSchema.safeParse(req.body);
      if (!validation.success)
        throw new BadRequestError(
          "Validation error",
          validation.error.format(),
        );
      const data = await OnboardingService.submit(validation.data, req.user, {
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      });
      return res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async submitWizard(req, res, next) {
    try {
      if (typeof req.body.school !== "string") {
        throw new BadRequestError("School details are required.");
      }

      let schoolInput;
      try {
        schoolInput = JSON.parse(req.body.school);
      } catch (error) {
        if (error instanceof SyntaxError) {
          throw new BadRequestError("School details must be valid JSON.");
        }
        throw error;
      }

      const validation = schoolWizardSchema.safeParse(schoolInput);
      if (!validation.success) {
        throw new BadRequestError(
          "Validation error",
          validation.error.format(),
        );
      }

      const documents = Object.fromEntries(
        Object.entries(req.files ?? {}).map(([field, files]) => [
          field,
          files[0],
        ]),
      );
      const data = await OnboardingService.submitWizard(
        validation.data,
        documents,
        req.user,
        {
          ipAddress: req.ip,
          userAgent: req.headers["user-agent"],
        },
      );
      return res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}
