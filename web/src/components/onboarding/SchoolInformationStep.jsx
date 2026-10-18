import { Hash, Link2, Quote, School } from 'lucide-react';
import { InputField } from '../ui/InputField.jsx';
import { FormTextarea } from './FormTextarea.jsx';
import { generateSlug } from '../../lib/slugify.js';

export function SchoolInformationStep({
  register,
  errors,
  dirtyFields,
  setValue,
  watch,
  slugEdited,
  setSlugEdited,
}) {
  const values = watch();

  const fieldSuccess = (name) =>
    Boolean(dirtyFields[name] && values[name] && !errors[name]);

  return (
    <div className="space-y-5">
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

      <div className="grid gap-5 sm:grid-cols-2">
        <InputField
          id="schoolCode"
          label="School Code"
          icon={Hash}
          autoComplete="off"
          error={errors.schoolCode?.message}
          success={fieldSuccess('schoolCode')}
          hint="A short unique identifier, e.g. GHS-001"
          registration={register('schoolCode', {
            onChange: (event) => {
              const next = event.target.value.toUpperCase();
              if (event.target.value !== next) {
                setValue('schoolCode', next, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }
            },
          })}
        />

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
