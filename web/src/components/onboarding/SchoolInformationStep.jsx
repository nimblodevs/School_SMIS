import { useEffect, useState } from 'react';
import { Image, Link2, Quote, School } from 'lucide-react';
import { InputField } from '../ui/InputField.jsx';
import { FormTextarea } from './FormTextarea.jsx';
import { generateSlug } from '../../lib/slugify.js';
import { previewSchoolCode } from '../../lib/schoolApi.js';

export function SchoolInformationStep({
  register,
  documents,
  setDocuments,
  logoPreview,
  setLogoPreview,
  errors,
  dirtyFields,
  setValue,
  watch,
  schoolCode,
  setSchoolCode,
  schoolCodeLoading,
  setSchoolCodeLoading,
  schoolCodeError,
  setSchoolCodeError,
  slugEdited,
  setSlugEdited,
}) {
  const values = watch();
  const logoFile = documents.logo;
  const [logoError, setLogoError] = useState('');

  const fieldSuccess = (name) =>
    Boolean(dirtyFields[name] && values[name] && !errors[name]);

  useEffect(() => {
    const schoolName = values.schoolName.trim();
    if (schoolName.length < 2) {
      setSchoolCode('');
      setSchoolCodeError('');
      setSchoolCodeLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    let active = true;
    setSchoolCode('');
    setSchoolCodeError('');
    setSchoolCodeLoading(true);
    const timer = window.setTimeout(async () => {
      try {
        const code = await previewSchoolCode(schoolName, {
          signal: controller.signal,
        });
        if (active) {
          setSchoolCode(code);
          setSchoolCodeError('');
        }
      } catch (error) {
        if (active && error.name !== 'AbortError') {
          setSchoolCodeError(error.message);
        }
      } finally {
        if (active) setSchoolCodeLoading(false);
      }
    }, 300);

    return () => {
      active = false;
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [
    values.schoolName,
    setSchoolCode,
    setSchoolCodeError,
    setSchoolCodeLoading,
  ]);

  const selectLogo = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      setLogoError('Choose a PNG, JPEG, or WebP image.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setLogoError('Logo image must be 2 MB or smaller.');
      return;
    }

    setLogoError('');
    setDocuments((current) => ({ ...current, logo: file }));
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') setLogoPreview(reader.result);
      else setLogoError('The selected logo could not be read. Please choose another image.');
    };
    reader.onerror = () => setLogoError('The selected logo could not be read. Please choose another image.');
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col items-center gap-2">
        <label
          htmlFor="onboarding-school-logo"
          title={logoFile ? 'Click to change school logo' : 'Click to upload school logo'}
          className="grid size-24 cursor-pointer place-items-center overflow-hidden rounded-full border-2 border-dashed border-line bg-page text-muted transition hover:border-forest hover:text-forest focus-within:ring-4 focus-within:ring-mint"
        >
          {logoPreview ? (
            <img src={logoPreview} alt="Selected school logo preview" className="size-full object-cover" />
          ) : (
            <Image aria-hidden="true" className="size-8" />
          )}
          <input
            id="onboarding-school-logo"
            aria-label="Choose school logo"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={selectLogo}
            className="sr-only"
          />
        </label>
        {logoError ? (
          <p role="alert" className="text-xs font-medium text-error">{logoError}</p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-[minmax(0,2fr)_minmax(12rem,1fr)]">
        <InputField
          id="schoolName"
          label="School Name"
          icon={School}
          autoComplete="organization"
          error={errors.schoolName?.message}
          success={fieldSuccess('schoolName')}
          registration={register('schoolName', {
            onChange: (event) => {
              if (!slugEdited) {
                setValue('schoolSlug', generateSlug(event.target.value), {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }
            },
          })}
        />
        <InputField
          id="schoolCode"
          label="School code"
          value={schoolCode}
          disabled
          error={schoolCodeError}
          hint={schoolCodeLoading ? 'Generating school code…' : undefined}
        />
      </div>

      <fieldset className="space-y-4 rounded-2xl border border-line bg-page/50 p-4 sm:p-5">
        <legend className="px-1 text-sm font-semibold text-deep">School identifiers</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            id="schoolNemisNo"
            label="NEMIS code"
            autoComplete="off"
            error={errors.schoolNemisNo?.message}
            success={fieldSuccess('schoolNemisNo')}
            registration={register('schoolNemisNo')}
          />
          <InputField
            id="schoolKraPin"
            label="KRA PIN"
            autoComplete="off"
            error={errors.schoolKraPin?.message}
            success={fieldSuccess('schoolKraPin')}
            registration={register('schoolKraPin')}
          />
          <div className="sm:col-span-2">
            <InputField
              id="schoolSlug"
              label="School Slug"
              icon={Link2}
              autoComplete="off"
              error={errors.schoolSlug?.message}
              success={fieldSuccess('schoolSlug')}
              hint={`Public URL: smis.school/${values.schoolSlug || 'your-school'}`}
              registration={register('schoolSlug', {
                onChange: () => setSlugEdited(true),
              })}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-deep">School structure</legend>
        <p className="text-xs leading-5 text-muted">
          Is this a standalone school or does it have multiple branches?
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              value: 'standalone',
              title: 'Standalone school',
              description: 'One school location',
            },
            {
              value: 'multi-branch',
              title: 'Multiple branches',
              description: 'Manage several school locations',
            },
          ].map((option) => (
            <label
              key={option.value}
              className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors ${
                values.schoolType === option.value
                  ? 'border-forest bg-mint/60 ring-2 ring-mint'
                  : 'border-line bg-white hover:border-mint-strong'
              }`}
            >
              <input
                type="radio"
                value={option.value}
                className="mt-1 size-4 accent-forest focus-visible:ring-2 focus-visible:ring-forest"
                {...register('schoolType', {
                  onChange: (event) => {
                    if (event.target.value === 'standalone') {
                      setValue('branches', [], { shouldDirty: true, shouldValidate: true });
                    }
                  },
                })}
              />
              <span>
                <span className="block text-sm font-semibold text-deep">{option.title}</span>
                <span className="mt-0.5 block text-xs text-muted">{option.description}</span>
              </span>
            </label>
          ))}
        </div>
        {errors.schoolType?.message ? (
          <p role="alert" className="text-xs font-medium text-error">
            {errors.schoolType.message}
          </p>
        ) : null}
      </fieldset>

      <InputField
        id="schoolMotto"
        label="School Motto"
        icon={Quote}
        error={errors.schoolMotto?.message}
        success={fieldSuccess('schoolMotto')}
        registration={register('schoolMotto')}
      />

      <FormTextarea
        id="visionStatement"
        label="Vision Statement"
        rows={4}
        error={errors.visionStatement?.message}
        success={fieldSuccess('visionStatement')}
        registration={register('visionStatement')}
      />

      <FormTextarea
        id="missionStatement"
        label="Mission Statement"
        rows={4}
        error={errors.missionStatement?.message}
        success={fieldSuccess('missionStatement')}
        registration={register('missionStatement')}
      />
    </div>
  );
}
