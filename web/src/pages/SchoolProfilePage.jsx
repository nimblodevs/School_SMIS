import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowLeft,
  Building2,
  FileCheck2,
  Globe,
  Image,
  Mail,
  MapPin,
  MapPinned,
  Phone,
  Quote,
  Save,
  School,
  ShieldCheck,
  Upload,
  UserRound,
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/Button.jsx';
import { InputField } from '../components/ui/InputField.jsx';
import { FormTextarea } from '../components/onboarding/FormTextarea.jsx';
import { getMockSchoolAccount, saveMockSchoolAccount } from '../lib/mockSchoolAccount.js';
import {
  getSchool,
  ensureSchoolApiRecord,
  removeSchoolLogo,
  updateSchool,
  uploadSchoolLogo,
} from '../lib/schoolApi.js';
import { onboardingSchema } from '../schemas/onboardingSchema.js';

const emptyLocation = {
  county: '',
  subCounty: '',
  ward: '',
  area: '',
  latitude: '',
  longitude: '',
  nearestLandmark: '',
};

function getProfileValues(account) {
  const school = account.school;
  const admin = account.primaryAdmin || {};
  const firstOwnership = school.ownerships?.[0] || {};

  return {
    ...school,
    confirmedAccurate: true,
    schoolLocation: { ...emptyLocation, ...school.schoolLocation },
    branches: school.branches || [],
    ownerships:
      school.ownerships?.length > 0
        ? school.ownerships
        : [
            {
              ownershipType: firstOwnership.ownershipType || '',
              schoolAdminName: admin.name || firstOwnership.schoolAdminName || '',
              schoolAdminEmail: admin.email || firstOwnership.schoolAdminEmail || '',
              schoolAdminMobile: admin.mobile || firstOwnership.schoolAdminMobile || '',
              alternativeMobile:
                admin.alternativeMobile || firstOwnership.alternativeMobile || '',
            },
          ],
  };
}

function ProfileSection({ id, title, description, icon: Icon, children }) {
  return (
    <section
      id={id}
      className="scroll-mt-80 space-y-5 rounded-3xl border border-line/80 bg-white p-5 shadow-[0_18px_50px_-40px_rgba(13,47,34,0.5)] sm:p-7"
    >
      <div className="flex items-start gap-3 border-b border-line/70 pb-5">
        {Icon ? (
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-mint/70 text-forest">
            <Icon aria-hidden="true" className="size-[18px]" />
          </span>
        ) : null}
        <div>
          <h2 className="text-base font-semibold text-deep">{title}</h2>
          {description ? <p className="mt-1 text-sm leading-5 text-muted">{description}</p> : null}
        </div>
      </div>
      {children}
    </section>
  );
}

function LocationFields({ prefix, errors, register }) {
  const fields = [
    ['county', 'County', MapPinned, true],
    ['subCounty', 'Sub County', MapPinned, true],
    ['ward', 'Ward', MapPinned, true],
    ['area', 'Area', MapPin, true],
    ['latitude', 'Latitude (optional)', MapPin, false],
    ['longitude', 'Longitude (optional)', MapPin, false],
    ['nearestLandmark', 'Nearest Landmark (optional)', MapPin, false],
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {fields.map(([name, label, icon, required]) => {
        const path = prefix ? `${prefix}.${name}` : `schoolLocation.${name}`;
        const fieldErrors = prefix
          ? errors.branches?.[Number(prefix.split('.')[1])]?.[name]
          : errors.schoolLocation?.[name];

        return (
          <InputField
            key={path}
            id={`profile-${path.replaceAll('.', '-')}`}
            label={label}
            icon={icon}
            inputMode={name === 'latitude' || name === 'longitude' ? 'decimal' : undefined}
            error={fieldErrors?.message}
            registration={register(path)}
            required={required}
            className="min-w-0"
          />
        );
      })}
    </div>
  );
}

export function SchoolProfilePage() {
  const [searchParams] = useSearchParams();
  const [account, setAccount] = useState(() => getMockSchoolAccount());
  const [saveError, setSaveError] = useState('');
  const [loadError, setLoadError] = useState('');
  const [loadedSchoolId, setLoadedSchoolId] = useState('');
  const [logoError, setLogoError] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [logoChanged, setLogoChanged] = useState(false);
  const [logoDataUrl, setLogoDataUrl] = useState(
    () =>
      getMockSchoolAccount()?.school?.logoUrl ||
      getMockSchoolAccount()?.school?.logoDataUrl ||
      '',
  );
  const [saved, setSaved] = useState(false);
  const schoolId =
    searchParams.get('schoolId') || account?.schoolId || account?.school?.id;
  const loadingProfile = Boolean(schoolId && loadedSchoolId !== schoolId && !loadError);
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(onboardingSchema),
    defaultValues: account?.school ? getProfileValues(account) : undefined,
    mode: 'onBlur',
  });
  const {
    fields: branches,
  } = useFieldArray({ control, name: 'branches' });
  const {
    fields: ownerships,
  } = useFieldArray({ control, name: 'ownerships' });

  useEffect(() => {
    const controller = new AbortController();
    const schoolRequest = schoolId
      ? getSchool(schoolId, { signal: controller.signal })
      : ensureSchoolApiRecord().then((updatedAccount) => {
          if (!updatedAccount?.school) {
            throw new Error('No school profile exists. Complete school onboarding first.');
          }
          return updatedAccount.school;
        });
    schoolRequest
      .then((school) => {
        const updatedAccount = {
          ...(getMockSchoolAccount() || {}),
          schoolId: school.id,
          school,
          primaryAdmin: school.primaryAdmin,
        };
        saveMockSchoolAccount(updatedAccount);
        setAccount(updatedAccount);
        setLoadedSchoolId(school.id);
        setLoadError('');
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setLoadError(error.message);
      });
    return () => controller.abort();
  }, [schoolId]);

  useEffect(() => {
    if (account?.school) reset(getProfileValues(account));
  }, [account, reset]);

  const onLogoSelected = (event) => {
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
    setSaved(false);
    setLogoFile(file);
    setLogoChanged(true);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        setLogoError('The selected logo could not be read. Please choose another image.');
        setLogoFile(null);
        setLogoChanged(false);
        return;
      }
      setLogoDataUrl(reader.result);
    };
    reader.onerror = () => {
      setLogoError('The selected logo could not be read. Please choose another image.');
      setLogoFile(null);
      setLogoChanged(false);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (values) => {
    setSaveError('');
    setSaved(false);
    const primaryOwnership = values.ownerships[0];
    try {
      if (!schoolId) {
        throw new Error('This school does not have an API record yet. Complete school onboarding first.');
      }
      const {
        schoolName: _schoolName,
        schoolCode: _schoolCode,
        confirmedAccurate: _confirmedAccurate,
        ...profileData
      } = values;
      let updatedSchool = await updateSchool(schoolId, profileData);
      if (logoChanged) {
        updatedSchool = logoFile
          ? await uploadSchoolLogo(schoolId, logoFile)
          : await removeSchoolLogo(schoolId);
      }
      const updatedAccount = {
        ...(getMockSchoolAccount() || account),
        schoolId,
        school: updatedSchool,
        primaryAdmin: updatedSchool.primaryAdmin || {
          name: primaryOwnership.schoolAdminName,
          email: primaryOwnership.schoolAdminEmail,
          mobile: primaryOwnership.schoolAdminMobile,
          alternativeMobile: primaryOwnership.alternativeMobile,
        },
      };
      saveMockSchoolAccount(updatedAccount);
      setAccount(updatedAccount);
      setLogoFile(null);
      setLogoChanged(false);
      setLogoDataUrl(updatedSchool.logoUrl || '');
      setSaved(true);
      setLogoError('');
    } catch (error) {
      setSaveError(error.message);
    }
  };

  if (!account?.school) {
    return (
      <section className="mx-auto max-w-3xl rounded-3xl border border-line bg-white p-8 text-center shadow-sm">
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-mint text-forest">
          <School aria-hidden="true" className="size-6" />
        </span>
        <h1 className="mt-5 text-2xl font-semibold text-deep">No school profile yet</h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          Create a school profile to manage its details and contact information.
        </p>
        {loadError ? (
          <p role="alert" className="mt-4 rounded-xl border border-error-border bg-error-soft px-4 py-3 text-sm text-error">
            {loadError}
          </p>
        ) : null}
        <Link
          to="/onboarding"
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-forest px-4 text-sm font-semibold text-white hover:bg-forest-dark focus-visible:ring-4 focus-visible:ring-mint focus-visible:outline-none"
        >
          Start school onboarding
        </Link>
      </section>
    );
  }

  const initials = account.school.schoolName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
  const locationsCount =
    account.school.schoolType === 'multi-branch' ? branches.length : 1;
  const displayedLogo = logoChanged
    ? logoDataUrl
    : account.school.logoUrl || account.school.logoDataUrl || '';
  const hasUnsavedChanges = isDirty || logoChanged;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      {loadError ? (
        <p role="alert" className="rounded-xl border border-error-border bg-error-soft px-4 py-3 text-sm text-error">
          {loadError}
        </p>
      ) : null}
      {loadingProfile ? (
        <p role="status" className="rounded-xl border border-line bg-white px-4 py-3 text-sm text-muted">
          Loading school profile…
        </p>
      ) : null}
      <section className="sticky top-[4.5rem] z-20 relative isolate overflow-hidden rounded-[2rem] bg-sidebar text-white shadow-[0_25px_65px_-40px_rgba(13,47,34,0.8)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-80"
          style={{
            background:
              'radial-gradient(circle at 85% 10%, rgba(102,190,137,0.34), transparent 35%), radial-gradient(circle at 12% 110%, rgba(232,244,238,0.12), transparent 40%)',
          }}
        />
        <div className="flex flex-col gap-7 p-5 sm:p-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-start gap-4 sm:gap-5">
            <span className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-2xl border border-white/15 bg-white/10 text-2xl font-semibold tracking-tight text-mint-strong shadow-inner sm:size-20 sm:rounded-3xl sm:text-3xl">
              {displayedLogo ? (
                <img src={displayedLogo} alt={`${account.school.schoolName} logo`} className="size-full bg-white object-contain p-1" />
              ) : (
                initials || <School aria-hidden="true" className="size-8" />
              )}
            </span>
            <div className="min-w-0">
              <Link
                to="/school/directory"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-white/65 transition hover:text-white"
              >
                <ArrowLeft aria-hidden="true" className="size-3.5" />
                School directory
              </Link>
              <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-mint-strong">
                School profile
              </p>
              <h1 className="mt-1 truncate text-2xl font-semibold tracking-tight sm:text-3xl">
                {account.school.schoolName}
              </h1>
              <p className="mt-2 max-w-xl text-sm italic text-white/70">
                {account.school.schoolMotto || 'Your school, your story.'}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.08] px-3 py-1.5 text-[11px] font-medium text-white/85">
                  <ShieldCheck aria-hidden="true" className="size-3.5 text-mint-strong" />
                  {account.school.schoolType === 'multi-branch' ? 'Multi-branch school' : 'Standalone school'}
                </span>
                <span className="rounded-full border border-white/15 bg-white/[0.08] px-3 py-1.5 text-[11px] font-medium text-white/85">
                  Code · {account.school.schoolCode}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 lg:min-w-64">
            {schoolId ? (
              <a
                href={`/api/schools/${encodeURIComponent(schoolId)}/profile.pdf`}
                className="inline-flex h-9 items-center justify-center gap-2 self-start rounded-xl border border-white/15 bg-white/[0.08] px-3 text-xs font-semibold text-white transition hover:bg-white/[0.15] focus-visible:ring-2 focus-visible:ring-mint-strong focus-visible:outline-none lg:self-end"
              >
                Export profile PDF
              </a>
            ) : null}
            <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.08] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/55">
                Locations
              </p>
              <p className="mt-2 text-2xl font-semibold">{locationsCount}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.08] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/55">
                School email
              </p>
              <p className="mt-2 truncate text-sm font-semibold">
                {account.school.schoolEmail || 'Not provided'}
              </p>
            </div>
          </div>
          </div>
        </div>
      </section>

      <div className="grid items-start gap-5 lg:grid-cols-[210px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-[20.125rem]">
          <nav aria-label="School profile sections" className="rounded-2xl border border-line bg-white p-3 shadow-sm">
            <p className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-[0.15em] text-muted">
              Profile details
            </p>
            <a href="#school-information" className="flex min-h-10 items-center gap-2 rounded-xl px-3 text-xs font-semibold text-deep transition hover:bg-mint/60 hover:text-accent">
              <School aria-hidden="true" className="size-4 text-forest" /> School information
            </a>
            <a href="#school-locations" className="flex min-h-10 items-center gap-2 rounded-xl px-3 text-xs font-semibold text-deep transition hover:bg-mint/60 hover:text-accent">
              <MapPin aria-hidden="true" className="size-4 text-forest" /> Locations
            </a>
            <a href="#school-documents" className="flex min-h-10 items-center gap-2 rounded-xl px-3 text-xs font-semibold text-deep transition hover:bg-mint/60 hover:text-accent">
              <FileCheck2 aria-hidden="true" className="size-4 text-forest" /> Documents
            </a>
            <a href="#school-contact" className="flex min-h-10 items-center gap-2 rounded-xl px-3 text-xs font-semibold text-deep transition hover:bg-mint/60 hover:text-accent">
              <Phone aria-hidden="true" className="size-4 text-forest" /> Contact
            </a>
            <a href="#school-admin" className="flex min-h-10 items-center gap-2 rounded-xl px-3 text-xs font-semibold text-deep transition hover:bg-mint/60 hover:text-accent">
              <UserRound aria-hidden="true" className="size-4 text-forest" /> Ownership &amp; admin
            </a>
            <div className="mt-3 border-t border-line pt-3">
              <p className="px-3 text-[11px] leading-5 text-muted">
                Edit details below, then save to update your school workspace.
              </p>
            </div>
          </nav>
        </aside>

        <form className="min-w-0 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <ProfileSection
          id="school-information"
          title="School information"
          description="Basic identity and public-facing details."
          icon={School}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <input type="hidden" {...register('schoolName')} />
            <input type="hidden" {...register('schoolCode')} />
            <div className="rounded-xl border border-line bg-page/60 p-4">
              <p className="text-[11px] font-semibold text-muted">School name</p>
              <p className="mt-1 text-sm font-semibold text-deep">{account.school.schoolName}</p>
              <p className="mt-1 text-[11px] text-muted">Contact support to change the school name.</p>
            </div>
            <div className="rounded-xl border border-line bg-page/60 p-4">
              <p className="text-[11px] font-semibold text-muted">School code</p>
              <p className="mt-1 text-sm font-semibold text-deep">{account.school.schoolCode}</p>
              <p className="mt-1 text-[11px] text-muted">School codes cannot be changed by admins.</p>
            </div>
            <div className="space-y-4 rounded-2xl border border-line bg-page/45 p-4 sm:col-span-2 sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <span className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-2xl border border-line bg-white text-forest shadow-sm">
                  {displayedLogo ? (
                    <img src={displayedLogo} alt="School logo preview" className="size-full bg-white object-contain p-1" />
                  ) : (
                    <Image aria-hidden="true" className="size-6" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-deep">School logo</h3>
                  <p className="mt-1 text-xs leading-5 text-muted">
                    Upload a PNG, JPEG, or WebP image up to 2 MB. Changes are applied when you save the profile.
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <label
                    htmlFor="profile-logo-upload"
                    className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-xl bg-forest px-3 text-xs font-semibold text-white transition hover:bg-forest-dark focus-within:ring-4 focus-within:ring-mint"
                  >
                    <Upload aria-hidden="true" className="size-3.5" />
                    {displayedLogo ? 'Update logo' : 'Upload logo'}
                  </label>
                  {displayedLogo ? (
                    <button
                      type="button"
                      onClick={() => {
                        setLogoDataUrl('');
                        setLogoFile(null);
                        setLogoChanged(true);
                        setLogoError('');
                        setSaved(false);
                      }}
                      className="h-9 rounded-xl border border-line bg-white px-3 text-xs font-semibold text-muted transition hover:bg-page hover:text-deep focus-visible:ring-2 focus-visible:ring-forest focus-visible:outline-none"
                    >
                      Remove
                    </button>
                  ) : null}
                  <input
                    id="profile-logo-upload"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={onLogoSelected}
                    className="sr-only"
                  />
                </div>
              </div>
              {logoError ? (
                <p role="alert" className="text-xs font-medium text-error">{logoError}</p>
              ) : null}
            </div>
            <InputField
              id="profile-schoolSlug"
              label="School slug"
              icon={Building2}
              error={errors.schoolSlug?.message}
              registration={register('schoolSlug')}
              required
            />
            <InputField
              id="profile-schoolMotto"
              label="School motto"
              icon={Quote}
              error={errors.schoolMotto?.message}
              registration={register('schoolMotto')}
              required
            />
          </div>
          <FormTextarea
            id="profile-visionStatement"
            label="Vision statement"
            rows={3}
            error={errors.visionStatement?.message}
            registration={register('visionStatement')}
          />
          <FormTextarea
            id="profile-missionStatement"
            label="Mission statement"
            rows={3}
            error={errors.missionStatement?.message}
            registration={register('missionStatement')}
          />
        </ProfileSection>

        <ProfileSection
          id="school-locations"
          title="School locations"
          description="Edit location details for the school and its branches."
          icon={MapPinned}
        >
          {account.school.schoolType === 'multi-branch' ? (
            <div className="space-y-5">
              {branches.map((branch, index) => (
                <section key={branch.id} className="space-y-4 rounded-2xl border border-line bg-page/60 p-4 sm:p-5">
                  <h3 className="text-sm font-semibold text-deep">Branch {index + 1}</h3>
                  <InputField
                    id={`profile-branch-${index}-name`}
                    label="Branch name"
                    icon={Building2}
                    error={errors.branches?.[index]?.name?.message}
                    registration={register(`branches.${index}.name`)}
                    required
                  />
                  <LocationFields prefix={`branches.${index}`} errors={errors} register={register} />
                </section>
              ))}
            </div>
          ) : (
            <LocationFields errors={errors} register={register} />
          )}
          {errors.branches?.message ? (
            <p role="alert" className="text-xs font-medium text-error">{errors.branches.message}</p>
          ) : null}
        </ProfileSection>

        <ProfileSection
          id="school-documents"
          title="School documents"
          description="Documents submitted during school onboarding."
          icon={FileCheck2}
        >
          {account.school.documents?.length ? (
            <div className="divide-y divide-line rounded-2xl border border-line bg-page/50 px-4">
              {account.school.documents.map((document) => (
                <div
                  key={document.id}
                  className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-deep">{document.label}</p>
                    <p className="mt-1 truncate text-xs text-muted">{document.originalName}</p>
                  </div>
                  <a
                    href={document.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-9 shrink-0 items-center justify-center rounded-xl border border-line bg-white px-3 text-xs font-semibold text-forest transition hover:border-mint-strong hover:bg-mint/40 focus-visible:ring-2 focus-visible:ring-forest focus-visible:outline-none"
                  >
                    View document
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border border-dashed border-line bg-page/50 px-4 py-6 text-center text-sm text-muted">
              No documents have been uploaded for this school.
            </p>
          )}
        </ProfileSection>

        <ProfileSection
          id="school-contact"
          title="Contact information"
          description="Public channels and head office details."
          icon={Phone}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField
              id="profile-officialPhone"
              label="Official phone number"
              icon={Phone}
              type="tel"
              error={errors.officialPhone?.message}
              registration={register('officialPhone')}
              required
            />
            <InputField
              id="profile-schoolEmail"
              label="School email"
              icon={Mail}
              type="email"
              error={errors.schoolEmail?.message}
              registration={register('schoolEmail')}
              required
            />
          </div>
          <InputField
            id="profile-website"
            label="Website (optional)"
            icon={Globe}
            type="url"
            error={errors.website?.message}
            registration={register('website')}
          />
          {account.school.schoolType === 'multi-branch' ? (
            <InputField
              id="profile-headOfficeAddress"
              label="Head office address (optional)"
              icon={MapPin}
              error={errors.headOfficeAddress?.message}
              registration={register('headOfficeAddress')}
            />
          ) : null}
        </ProfileSection>

        <ProfileSection
          id="school-admin"
          title="Ownership and school admin"
          description="The first admin listed remains the primary administrator for this school workspace."
          icon={UserRound}
        >
          {ownerships.map((ownership, index) => {
            const prefix = `ownerships.${index}`;
            const ownerErrors = errors.ownerships?.[index];

            return (
              <section key={ownership.id} className="space-y-4 rounded-2xl border border-line bg-page/60 p-4 sm:p-5">
                <h3 className="text-sm font-semibold text-deep">
                  {index === 0 ? 'Primary school admin' : `Owner / admin ${index + 1}`}
                </h3>
                <div className="space-y-1.5">
                  <label htmlFor={`profile-ownershipType-${index}`} className="block text-xs font-semibold text-deep">
                    Ownership type
                  </label>
                  <select
                    id={`profile-ownershipType-${index}`}
                    {...register(`${prefix}.ownershipType`)}
                    aria-invalid={Boolean(ownerErrors?.ownershipType)}
                    className="h-11 w-full rounded-xl border border-line bg-white px-3 text-sm text-ink outline-none focus:border-forest focus:ring-4 focus:ring-mint"
                  >
                    <option value="">Select ownership type</option>
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                  {ownerErrors?.ownershipType?.message ? (
                    <p role="alert" className="text-xs font-medium text-error">{ownerErrors.ownershipType.message}</p>
                  ) : null}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <InputField
                    id={`profile-admin-name-${index}`}
                    label="Admin name"
                    icon={UserRound}
                    error={ownerErrors?.schoolAdminName?.message}
                    registration={register(`${prefix}.schoolAdminName`)}
                    required
                  />
                  <InputField
                    id={`profile-admin-email-${index}`}
                    label="Admin email"
                    icon={Mail}
                    type="email"
                    error={ownerErrors?.schoolAdminEmail?.message}
                    registration={register(`${prefix}.schoolAdminEmail`)}
                    required
                  />
                  <InputField
                    id={`profile-admin-mobile-${index}`}
                    label="Admin mobile"
                    icon={Phone}
                    type="tel"
                    error={ownerErrors?.schoolAdminMobile?.message}
                    registration={register(`${prefix}.schoolAdminMobile`)}
                    required
                  />
                  <InputField
                    id={`profile-admin-alt-mobile-${index}`}
                    label="Alternative mobile (optional)"
                    icon={Phone}
                    type="tel"
                    error={ownerErrors?.alternativeMobile?.message}
                    registration={register(`${prefix}.alternativeMobile`)}
                  />
                </div>
              </section>
            );
          })}
          {errors.ownerships?.message ? (
            <p role="alert" className="text-xs font-medium text-error">{errors.ownerships.message}</p>
          ) : null}
        </ProfileSection>

        {saveError ? (
          <p role="alert" className="rounded-xl border border-error-border bg-error-soft px-4 py-3 text-sm text-error">
            {saveError}
          </p>
        ) : null}
        {saved ? (
          <p role="status" className="rounded-xl border border-success/30 bg-mint/40 px-4 py-3 text-sm font-medium text-forest">
            School profile updated.
          </p>
        ) : null}
        <div className="sticky bottom-3 z-10 flex flex-col-reverse gap-3 rounded-2xl border border-line bg-white/95 p-3 shadow-[0_15px_45px_-25px_rgba(13,47,34,0.45)] backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-4">
          <p className="px-1 text-xs text-muted">
            {hasUnsavedChanges ? 'You have unsaved changes.' : saved ? 'All changes saved.' : 'Profile is up to date.'}
          </p>
          <div className="flex flex-col-reverse gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            disabled={!hasUnsavedChanges || isSubmitting}
            onClick={() => {
              reset(getProfileValues(account));
              setLogoDataUrl(account.school.logoUrl || account.school.logoDataUrl || '');
              setLogoFile(null);
              setLogoChanged(false);
              setSaveError('');
              setLogoError('');
              setSaved(false);
            }}
          >
            Discard changes
          </Button>
          <Button type="submit" disabled={!hasUnsavedChanges || isSubmitting}>
            <Save aria-hidden="true" className="size-4" />
            {isSubmitting ? 'Saving…' : 'Save profile'}
          </Button>
          </div>
        </div>
      </form>
      </div>
    </div>
  );
}
