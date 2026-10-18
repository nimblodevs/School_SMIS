import { useFieldArray } from 'react-hook-form';
import { Building2, MapPin, MapPinned, Plus, Trash2 } from 'lucide-react';
import { InputField } from '../ui/InputField.jsx';

function LocationFields({ prefix, register, errors, idPrefix }) {
  const fields = [
    { name: 'county', label: 'County', icon: MapPinned, required: true },
    { name: 'subCounty', label: 'Sub County', icon: MapPinned, required: true },
    { name: 'ward', label: 'Ward', icon: MapPinned, required: true },
    { name: 'area', label: 'Area', icon: MapPin, required: true },
    { name: 'latitude', label: 'Latitude', icon: MapPin, inputMode: 'decimal' },
    { name: 'longitude', label: 'Longitude', icon: MapPin, inputMode: 'decimal' },
    { name: 'nearestLandmark', label: 'Nearest Landmark', icon: Building2 },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {fields.map(({ name, label, icon, inputMode, required }) => (
        <InputField
          key={name}
          id={`${idPrefix}-${name}`}
          label={label}
          icon={icon}
          inputMode={inputMode}
          required={required}
          error={errors?.[name]?.message}
          registration={register(`${prefix}.${name}`)}
        />
      ))}
    </div>
  );
}

export function SchoolLocationStep({ register, errors, control, clearErrors, schoolType }) {
  const { fields: branches, append, remove } = useFieldArray({
    control,
    name: 'branches',
  });

  if (schoolType === 'standalone') {
    return (
      <section className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-deep">School location</h3>
          <p className="mt-1 text-xs text-muted">
            Enter the location details for this school.
          </p>
        </div>
        <LocationFields
          prefix="schoolLocation"
          idPrefix="school-location"
          register={register}
          errors={errors.schoolLocation}
        />
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-deep">Branch locations</h3>
          <p className="mt-1 text-xs text-muted">
            Enter the address and coordinates for each school branch.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            append({
              name: '',
              county: '',
              subCounty: '',
              ward: '',
              area: '',
              latitude: '',
              longitude: '',
              nearestLandmark: '',
            });
            clearErrors('schoolType');
          }}
          className="inline-flex h-9 items-center justify-center gap-2 self-start rounded-xl border border-line bg-white px-3 text-xs font-semibold text-forest transition-colors hover:border-mint-strong hover:bg-mint focus-visible:ring-4 focus-visible:ring-mint focus-visible:outline-none sm:self-auto"
        >
          <Plus aria-hidden="true" className="size-4" />
          Add branch
        </button>
      </div>

      {errors.schoolType?.message ? (
        <p role="alert" className="text-xs font-medium text-error">
          {errors.schoolType.message}
        </p>
      ) : null}

      {branches.map((branch, index) => (
        <div key={branch.id} className="space-y-4 rounded-2xl border border-line bg-page/70 p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted">
              Branch {index + 1}
            </h4>
            <button
              type="button"
              aria-label={`Remove branch ${index + 1}`}
              onClick={() => remove(index)}
              className="grid size-8 place-items-center rounded-lg text-muted transition-colors hover:bg-error-soft hover:text-error focus-visible:ring-2 focus-visible:ring-error focus-visible:outline-none"
            >
              <Trash2 aria-hidden="true" className="size-4" />
            </button>
          </div>
          <InputField
            id={`branch-${index}-name`}
            label="Branch name"
            icon={Building2}
            error={errors.branches?.[index]?.name?.message}
            registration={register(`branches.${index}.name`)}
          />
          <LocationFields
            prefix={`branches.${index}`}
            idPrefix={`branch-${index}`}
            register={register}
            errors={errors.branches?.[index]}
          />
        </div>
      ))}
    </section>
  );
}
