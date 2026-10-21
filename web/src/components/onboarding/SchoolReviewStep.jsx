import { Building2, FileCheck2, MapPin, Pencil, Phone, Quote, UserRound } from 'lucide-react';
import { Button } from '../ui/Button.jsx';

function ReviewRow({ label, value }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[140px_1fr] sm:gap-4">
      <dt className="text-xs font-semibold tracking-wide text-muted uppercase">{label}</dt>
      <dd className="text-sm leading-relaxed text-ink whitespace-pre-wrap">
        {value?.toString().trim() ? value : <span className="text-muted">Not provided</span>}
      </dd>
    </div>
  );
}

function ReviewSection({ title, icon: Icon, onEdit, children }) {
  return (
    <section className="rounded-2xl border border-line bg-page/70 p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-mint text-forest">
            <Icon className="size-4" />
          </span>
          <h3 className="text-sm font-semibold text-deep">{title}</h3>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onEdit}
        >
          <Pencil className="size-3.5" />
          Edit
        </Button>
      </div>
      <dl className="space-y-3">{children}</dl>
    </section>
  );
}

export function SchoolReviewStep({
  values,
  documents,
  errors,
  register,
  onEditSection,
  schoolCode,
}) {
  return (
    <div className="space-y-5">
      <ReviewSection
        title="School identity"
        icon={Quote}
        onEdit={() => onEditSection(0)}
      >
        <ReviewRow label="School name" value={values.schoolName} />
        <ReviewRow label="School logo" value={documents.logo?.name} />
        <ReviewRow label="School code" value={schoolCode} />
        <ReviewRow label="NEMIS code" value={values.schoolNemisNo} />
        <ReviewRow label="KRA PIN" value={values.schoolKraPin} />
        <ReviewRow label="School slug" value={values.schoolSlug} />
        <ReviewRow
          label="School structure"
          value={values.schoolType === 'multi-branch' ? 'Multiple branches' : 'Standalone school'}
        />
        <ReviewRow label="Motto" value={values.schoolMotto} />
        <ReviewRow label="Vision" value={values.visionStatement} />
        <ReviewRow label="Mission" value={values.missionStatement} />
      </ReviewSection>

      <ReviewSection
        title="Location details"
        icon={MapPin}
        onEdit={() => onEditSection(1)}
      >
        {values.schoolType === 'standalone' ? (
          <>
            <ReviewRow label="County" value={values.schoolLocation.county} />
            <ReviewRow label="Sub County" value={values.schoolLocation.subCounty} />
            <ReviewRow label="Ward" value={values.schoolLocation.ward} />
            <ReviewRow label="Area" value={values.schoolLocation.area} />
            <ReviewRow label="Latitude" value={values.schoolLocation.latitude} />
            <ReviewRow label="Longitude" value={values.schoolLocation.longitude} />
            <ReviewRow label="Nearest Landmark" value={values.schoolLocation.nearestLandmark} />
          </>
        ) : (
          values.branches.map((branch, index) => (
            <div
              key={`${branch.name}-${index}`}
              className="space-y-3 rounded-xl border border-line bg-white p-4"
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-deep">
                <Building2 aria-hidden="true" className="size-4 text-forest" />
                {branch.name}
              </div>
              <div className="space-y-3">
                <ReviewRow label="County" value={branch.county} />
                <ReviewRow label="Sub County" value={branch.subCounty} />
                <ReviewRow label="Ward" value={branch.ward} />
                <ReviewRow label="Area" value={branch.area} />
                <ReviewRow label="Latitude" value={branch.latitude} />
                <ReviewRow label="Longitude" value={branch.longitude} />
                <ReviewRow label="Nearest Landmark" value={branch.nearestLandmark} />
              </div>
            </div>
          ))
        )}
      </ReviewSection>

      <ReviewSection
        title="School documents"
        icon={FileCheck2}
        onEdit={() => onEditSection(2)}
      >
        <ReviewRow
          label="School registration certificate"
          value={documents.registrationCertificate?.name}
        />
        <ReviewRow
          label="Fire safety certificate"
          value={documents.fireSafetyCertificate?.name}
        />
        <ReviewRow
          label="Public health certificate"
          value={documents.publicHealthCertificate?.name}
        />
        <ReviewRow label="Operating licence" value={documents.operatingLicence?.name} />
        <ReviewRow
          label="Other supporting document"
          value={documents.otherSupportingDocument?.name}
        />
      </ReviewSection>

      <ReviewSection
        title="Contact details"
        icon={Phone}
        onEdit={() => onEditSection(3)}
      >
        <ReviewRow label="Phone" value={values.officialPhone} />
        <ReviewRow label="Email" value={values.schoolEmail} />
        <ReviewRow label="Website" value={values.website} />
        {values.schoolType === 'multi-branch' ? (
          <ReviewRow label="Head Office Address" value={values.headOfficeAddress} />
        ) : null}
      </ReviewSection>

      <ReviewSection
        title="Ownership & School Admin"
        icon={UserRound}
        onEdit={() => onEditSection(3)}
      >
        {values.ownerships.map((ownership, index) => (
          <div
            key={`${ownership.schoolAdminEmail}-${index}`}
            className="space-y-3 rounded-xl border border-line bg-white p-4"
          >
            <ReviewRow
              label={index === 0 ? 'Primary admin ownership' : `Ownership ${index + 1}`}
              value={ownership.ownershipType === 'public' ? 'Public' : 'Private'}
            />
            <ReviewRow label="School Admin Name" value={ownership.schoolAdminName} />
            <ReviewRow label="School Admin Email" value={ownership.schoolAdminEmail} />
            <ReviewRow label="School Admin Mobile" value={ownership.schoolAdminMobile} />
            {ownership.alternativeMobile ? (
              <ReviewRow label="Alternative Mobile" value={ownership.alternativeMobile} />
            ) : null}
          </div>
        ))}
      </ReviewSection>

      <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-line bg-white p-4 transition-colors has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-mint">
        <input
          type="checkbox"
          className="mt-0.5 size-4 rounded border-line text-forest accent-forest focus-visible:ring-4 focus-visible:ring-mint"
          {...register('confirmedAccurate')}
        />
        <span>
          <span className="block text-sm font-medium text-deep">
            I confirm that this information is accurate
          </span>
          <span className="mt-0.5 block text-xs leading-relaxed text-muted">
            These details will be used as the official school profile in School SMIS.
          </span>
          {errors.confirmedAccurate?.message ? (
            <span className="mt-1.5 block text-xs font-medium text-error" role="alert">
              {errors.confirmedAccurate.message}
            </span>
          ) : null}
        </span>
      </label>
    </div>
  );
}
