import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, LoaderCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button.jsx';
import { ProgressIndicator } from '../../components/onboarding/ProgressIndicator.jsx';
import { SchoolInformationStep } from '../../components/onboarding/SchoolInformationStep.jsx';
import { SchoolLocationStep } from '../../components/onboarding/SchoolLocationStep.jsx';
import { SchoolDocumentsStep } from '../../components/onboarding/SchoolDocumentsStep.jsx';
import { SchoolContactStep } from '../../components/onboarding/SchoolContactStep.jsx';
import { SchoolReviewStep } from '../../components/onboarding/SchoolReviewStep.jsx';
import {
  defaultOnboardingValues,
  STEP_FIELDS,
  STEP_SCHEMAS,
} from '../../schemas/onboardingSchema.js';
import { saveMockSchoolAccount } from '../../lib/mockSchoolAccount.js';
import { createSchool } from '../../lib/schoolApi.js';

const STEPS = [
  {
    id: 'identity',
    title: 'School information',
    description: 'Name, code, motto, vision, and mission.',
  },
  {
    id: 'location',
    title: 'Location details',
    description: 'Provide the school location or details for each branch.',
  },
  {
    id: 'documents',
    title: 'School documents',
    description: 'Upload your registration and safety certificates.',
  },
  {
    id: 'contact',
    title: 'Contact information',
    description: 'How families and staff can reach you.',
  },
  {
    id: 'review',
    title: 'Review and confirmation',
    description: 'Check everything before you finish.',
  },
];

export function SchoolOnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [slugEdited, setSlugEdited] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [documents, setDocuments] = useState({});
  const [documentStepError, setDocumentStepError] = useState('');
  const submittingRef = useRef(false);
  const stepRef = useRef(0);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    clearErrors,
    setValue,
    control,
    formState: { errors, dirtyFields },
  } = useForm({
    resolver: async (values, context, options) =>
      zodResolver(STEP_SCHEMAS[stepRef.current])(values, context, options),
    defaultValues: defaultOnboardingValues,
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const syncStep = (nextStep) => {
    stepRef.current = nextStep;
    setStep(nextStep);
  };

  const values = watch();

  const goNext = async () => {
    if (stepRef.current === 2) {
      const missingRequiredDocuments = [
        ['registrationCertificate', 'school registration certificate'],
        ['fireSafetyCertificate', 'fire safety certificate'],
      ]
        .filter(([field]) => !documents[field])
        .map(([, label]) => label);
      if (missingRequiredDocuments.length) {
        setDocumentStepError(
          `Upload the required ${missingRequiredDocuments.join(' and ')} to continue.`,
        );
        return;
      }
      setDocumentStepError('');
      syncStep(3);
      return;
    }
    const valid = await trigger(STEP_FIELDS[stepRef.current], { shouldFocus: true });
    if (valid) {
      syncStep(Math.min(stepRef.current + 1, STEPS.length - 1));
    }
  };

  const goBack = () => {
    syncStep(Math.max(stepRef.current - 1, 0));
  };

  const onSubmit = async (submittedValues, event) => {
    if (stepRef.current < STEPS.length - 1) {
      event?.preventDefault?.();
      await goNext();
      return;
    }

    if (submittingRef.current) return;

    const valid = await trigger(STEP_FIELDS[4], { shouldFocus: true });
    if (!valid) return;

    submittingRef.current = true;
    setSubmitting(true);
    const primaryOwnership = submittedValues.ownerships[0];
    const requestedPrimaryAdmin = {
      name: primaryOwnership.schoolAdminName,
      email: primaryOwnership.schoolAdminEmail,
      mobile: primaryOwnership.schoolAdminMobile,
      alternativeMobile: primaryOwnership.alternativeMobile,
    };
    setSubmitError('');
    try {
      const createdSchool = await createSchool(submittedValues, documents);
      const primaryAdmin = createdSchool.primaryAdmin || requestedPrimaryAdmin;
      saveMockSchoolAccount({
        schoolId: createdSchool.id,
        school: createdSchool,
        primaryAdmin,
        requiresPasswordChange: false,
      });
      navigate('/overview', {
        replace: true,
        state: { school: createdSchool, primaryAdmin },
      });
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setSubmitting(false);
      submittingRef.current = false;
    }
  };

  const current = STEPS[step];

  return (
    <section className="flex justify-center">
      <div className="w-full max-w-2xl">
        <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-[0_18px_50px_-28px_rgba(13,47,34,0.35)]">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="border-b border-line px-5 py-6 sm:px-8">
              <ProgressIndicator currentStep={step} totalSteps={STEPS.length} />
              <h2 className="mt-5 text-2xl font-semibold tracking-tight text-deep">
                {current.title}
              </h2>
              <p className="mt-1 text-sm text-muted">{current.description}</p>
            </div>

            <div className="px-5 py-6 sm:px-8">
              {submitError ? (
                <p role="alert" className="mb-5 rounded-xl border border-error-border bg-error-soft px-4 py-3 text-sm text-error">
                  {submitError}
                </p>
              ) : null}
              {step === 0 ? (
                <SchoolInformationStep
                  register={register}
                  errors={errors}
                  dirtyFields={dirtyFields}
                  setValue={setValue}
                  watch={watch}
                  slugEdited={slugEdited}
                  setSlugEdited={setSlugEdited}
                />
              ) : null}

              {step === 1 ? (
                <SchoolLocationStep
                  register={register}
                  errors={errors}
                  control={control}
                  clearErrors={clearErrors}
                  schoolType={values.schoolType}
                />
              ) : null}

              {step === 2 ? (
                <SchoolDocumentsStep
                  documents={documents}
                  setDocuments={setDocuments}
                  requiredError={documentStepError}
                />
              ) : null}

              {step === 3 ? (
                <SchoolContactStep
                  register={register}
                  errors={errors}
                  dirtyFields={dirtyFields}
                  watch={watch}
                  schoolType={values.schoolType}
                  control={control}
                  clearErrors={clearErrors}
                />
              ) : null}

              {step === 4 ? (
                <SchoolReviewStep
                  values={values}
                  documents={documents}
                  errors={errors}
                  register={register}
                  onEditSection={syncStep}
                />
              ) : null}
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-line px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <Button
                type="button"
                variant="outline"
                onClick={goBack}
                disabled={step === 0 || submitting}
              >
                <ArrowLeft className="size-4" />
                Back
              </Button>

              {step < STEPS.length - 1 ? (
                <Button type="button" onClick={goNext}>
                  Continue
                  <ArrowRight className="size-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={submitting}
                  className="disabled:cursor-wait disabled:opacity-80"
                >
                  {submitting ? (
                    <>
                      <LoaderCircle className="size-4 animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    'Submit onboarding'
                  )}
                </Button>
              )}
            </div>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          School data is submitted to the configured API. Authentication remains in development-only demo mode.
        </p>
      </div>
    </section>
  );
}
