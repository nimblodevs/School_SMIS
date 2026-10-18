import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, MapPin, MapPinned, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { schoolBranchSchema } from '../../schemas/onboardingSchema.js';
import { Button } from '../ui/Button.jsx';
import { InputField } from '../ui/InputField.jsx';

const defaultValues = {
  name: '',
  county: '',
  subCounty: '',
  ward: '',
  area: '',
  latitude: '',
  longitude: '',
  nearestLandmark: '',
};

export function AddBranchForm({ onAdd, onCancel, error }) {
  const dialogRef = useRef(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schoolBranchSchema),
    defaultValues,
  });

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.querySelector('input')?.focus();
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        if (!isSubmitting) onCancel();
        return;
      }

      if (event.key === 'Tab') {
        const focusableElements = dialogRef.current?.querySelectorAll(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
        );
        if (!focusableElements?.length) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [isSubmitting, onCancel]);

  const submitBranch = async (branch) => {
    const added = await onAdd(branch);
    if (added) onCancel();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-deep/55 p-0 backdrop-blur-sm sm:items-center sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) onCancel();
      }}
    >
      <form
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-branch-title"
        className="max-h-[min(92vh,52rem)] w-full max-w-2xl space-y-5 overflow-y-auto rounded-t-3xl border border-line bg-white p-5 shadow-[0_30px_100px_-35px_rgba(0,0,0,0.55)] sm:rounded-3xl sm:p-7"
        onSubmit={handleSubmit(submitBranch)}
        noValidate
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 id="add-branch-title" className="text-lg font-semibold text-deep">
              Add school branch
            </h3>
            <p className="mt-1 text-sm text-muted">
              Add its name and location. Adding a branch changes this school to multiple branches.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close add branch dialog"
            onClick={onCancel}
            disabled={isSubmitting}
            className="grid size-9 shrink-0 place-items-center rounded-xl text-muted transition-colors hover:bg-page hover:text-deep focus-visible:ring-2 focus-visible:ring-forest focus-visible:outline-none disabled:opacity-50"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>

        {error ? (
          <p
            role="alert"
            className="rounded-xl border border-error-border bg-error-soft px-4 py-3 text-sm text-error"
          >
            {error}
          </p>
        ) : null}

        <InputField
          id="newBranchName"
          label="Branch name"
          icon={Building2}
          error={errors.name?.message}
          registration={register('name')}
          required
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            id="newBranchCounty"
            label="County"
            icon={MapPinned}
            error={errors.county?.message}
            registration={register('county')}
            required
          />
          <InputField
            id="newBranchSubCounty"
            label="Sub County"
            icon={MapPinned}
            error={errors.subCounty?.message}
            registration={register('subCounty')}
            required
          />
          <InputField
            id="newBranchWard"
            label="Ward"
            icon={MapPinned}
            error={errors.ward?.message}
            registration={register('ward')}
            required
          />
          <InputField
            id="newBranchArea"
            label="Area"
            icon={MapPin}
            error={errors.area?.message}
            registration={register('area')}
            required
          />
          <InputField
            id="newBranchLatitude"
            label="Latitude (optional)"
            icon={MapPin}
            inputMode="decimal"
            error={errors.latitude?.message}
            registration={register('latitude')}
          />
          <InputField
            id="newBranchLongitude"
            label="Longitude (optional)"
            icon={MapPin}
            inputMode="decimal"
            error={errors.longitude?.message}
            registration={register('longitude')}
          />
          <div className="sm:col-span-2">
            <InputField
              id="newBranchNearestLandmark"
              label="Nearest Landmark (optional)"
              icon={MapPin}
              error={errors.nearestLandmark?.message}
              registration={register('nearestLandmark')}
            />
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-line pt-4 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Adding branch…' : 'Add branch'}
          </Button>
        </div>
      </form>
    </div>
  );
}
