import { useFieldArray } from 'react-hook-form';
import { Globe, Mail, MapPin, Phone, Plus, Trash2, UserRound } from 'lucide-react';
import { InputField } from '../ui/InputField.jsx';

export function SchoolContactStep({
  register,
  errors,
  dirtyFields,
  watch,
  schoolType,
  control,
  clearErrors,
}) {
  const values = watch();
  const {
    fields: ownerships,
    append: addOwnership,
    remove: removeOwnership,
  } = useFieldArray({ control, name: 'ownerships' });

  const fieldSuccess = (name) =>
    Boolean(dirtyFields[name] && values[name] && !errors[name]);

  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <InputField
          id="officialPhone"
          label="Official Phone Number"
          icon={Phone}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          error={errors.officialPhone?.message}
          success={fieldSuccess('officialPhone')}
          registration={register('officialPhone')}
        />

        <InputField
          id="schoolEmail"
          label="School Email"
          icon={Mail}
          type="email"
          autoComplete="email"
          error={errors.schoolEmail?.message}
          success={fieldSuccess('schoolEmail')}
          registration={register('schoolEmail')}
        />
      </div>

      <InputField
        id="website"
        label="Website (optional)"
        icon={Globe}
        type="url"
        autoComplete="url"
        error={errors.website?.message}
        success={fieldSuccess('website')}
        hint="Include http:// or https://"
        registration={register('website')}
      />

      {schoolType === 'multi-branch' ? (
        <InputField
          id="headOfficeAddress"
          label="Head Office Address (optional)"
          icon={MapPin}
          autoComplete="street-address"
          error={errors.headOfficeAddress?.message}
          success={fieldSuccess('headOfficeAddress')}
          registration={register('headOfficeAddress')}
        />
      ) : null}

      <section className="space-y-4 border-t border-line pt-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-deep">Ownership &amp; School Admin</h3>
            <p className="mt-1 text-xs text-muted">
              Each school admin email receives a system-generated temporary password. Admins must change it after signing in.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              addOwnership({
                ownershipType: '',
                schoolAdminName: '',
                schoolAdminEmail: '',
                schoolAdminMobile: '',
                alternativeMobile: '',
              });
              clearErrors('ownerships');
            }}
            className="inline-flex h-9 items-center justify-center gap-2 self-start rounded-xl border border-line bg-white px-3 text-xs font-semibold text-forest transition-colors hover:border-mint-strong hover:bg-mint focus-visible:ring-4 focus-visible:ring-mint focus-visible:outline-none sm:self-auto"
          >
            <Plus aria-hidden="true" className="size-4" />
            Add owner / admin
          </button>
        </div>

        {ownerships.map((ownership, index) => {
          const entryErrors = errors.ownerships?.[index];
          const prefix = `ownerships.${index}`;

          return (
            <section
              key={ownership.id}
              className="space-y-4 rounded-2xl border border-line bg-page/70 p-4"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted">
                  {index === 0 ? 'Primary school admin' : `Additional owner / admin ${index}`}
                </h4>
                {ownerships.length > 1 ? (
                  <button
                    type="button"
                    aria-label={`Remove ownership ${index + 1}`}
                    onClick={() => removeOwnership(index)}
                    className="grid size-8 place-items-center rounded-lg text-muted transition-colors hover:bg-error-soft hover:text-error focus-visible:ring-2 focus-visible:ring-error focus-visible:outline-none"
                  >
                    <Trash2 aria-hidden="true" className="size-4" />
                  </button>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor={`ownership-${index}-type`}
                  className="block text-xs font-semibold text-deep"
                >
                  Ownership type
                </label>
                <select
                  id={`ownership-${index}-type`}
                  {...register(`${prefix}.ownershipType`)}
                  aria-invalid={Boolean(entryErrors?.ownershipType)}
                  aria-describedby={
                    entryErrors?.ownershipType ? `ownership-${index}-type-error` : undefined
                  }
                  className={`h-11 w-full rounded-xl border bg-white px-3 text-sm text-ink outline-none focus:border-forest focus:ring-4 focus:ring-mint ${
                    entryErrors?.ownershipType ? 'border-error-border' : 'border-line'
                  }`}
                >
                  <option value="">Select ownership type</option>
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
                {entryErrors?.ownershipType?.message ? (
                  <p
                    id={`ownership-${index}-type-error`}
                    role="alert"
                    className="text-xs font-medium text-error"
                  >
                    {entryErrors.ownershipType.message}
                  </p>
                ) : null}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <InputField
                  id={`ownership-${index}-admin-name`}
                  label="School Admin Name"
                  icon={UserRound}
                  error={entryErrors?.schoolAdminName?.message}
                  registration={register(`${prefix}.schoolAdminName`)}
                />
                <InputField
                  id={`ownership-${index}-admin-email`}
                  label="School Admin Email"
                  icon={Mail}
                  type="email"
                  error={entryErrors?.schoolAdminEmail?.message}
                  registration={register(`${prefix}.schoolAdminEmail`)}
                />
                <InputField
                  id={`ownership-${index}-admin-mobile`}
                  label="School Admin Mobile"
                  icon={Phone}
                  type="tel"
                  inputMode="tel"
                  error={entryErrors?.schoolAdminMobile?.message}
                  registration={register(`${prefix}.schoolAdminMobile`)}
                />
                <InputField
                  id={`ownership-${index}-alternative-mobile`}
                  label="Alternative Mobile (optional)"
                  icon={Phone}
                  type="tel"
                  inputMode="tel"
                  error={entryErrors?.alternativeMobile?.message}
                  registration={register(`${prefix}.alternativeMobile`)}
                />
              </div>
            </section>
          );
        })}
      </section>
    </div>
  );
}
