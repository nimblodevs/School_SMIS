import { useState } from 'react';
import {
  ArrowRight,
  Building2,
  ClipboardList,
  MapPin,
  Plus,
  School,
  UsersRound,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { getMockSchoolAccount, saveMockSchoolAccount } from '../lib/mockSchoolAccount.js';
import { AddBranchForm } from '../components/dashboard/AddBranchForm.jsx';
import { addSchoolBranch } from '../lib/schoolApi.js';
import { useAuth } from '../lib/useAuth.js';

const metricCards = [
  { label: 'Students', value: '0', detail: 'Ready when you are', icon: UsersRound },
  { label: 'Staff', value: '0', detail: 'No staff added yet', icon: ClipboardList },
  { label: 'Branches', valueFor: 'branches', detail: 'School locations', icon: Building2 },
  { label: 'Admissions', value: '0', detail: 'No applications yet', icon: School },
];

export function DashboardOverviewPage() {
  const { state } = useLocation();
  const { user } = useAuth();
  const mockAccount = getMockSchoolAccount();
  const [school, setSchool] = useState(mockAccount?.school || state?.school);
  const [primaryAdmin, setPrimaryAdmin] = useState(
    mockAccount?.primaryAdmin || state?.primaryAdmin,
  );
  const [isAddingBranch, setIsAddingBranch] = useState(false);
  const [branchError, setBranchError] = useState('');
  const [branchScope, setBranchScope] = useState('all');

  const schoolName = school?.schoolName || 'Your school';
  const branches =
    school?.schoolType === 'multi-branch'
      ? school.branches || []
      : school?.schoolLocation
        ? [{ name: schoolName, ...school.schoolLocation }]
        : [];
  const branchCount = school?.schoolType === 'multi-branch' ? branches.length : 0;
  const selectedBranch =
    branchScope === 'all' ? null : branches[Number(branchScope)] || null;
  const displayedBranches = selectedBranch ? [selectedBranch] : branches;
  const schoolLocation =
    school?.schoolType === 'standalone' && school?.schoolLocation
      ? school.schoolLocation
      : null;
  const visibleMetricCards = metricCards.filter(
    (card) => card.valueFor !== 'branches' || school?.schoolType === 'multi-branch',
  );

  const addBranch = async (branch) => {
    const existingAccount = getMockSchoolAccount();
    const currentSchool = school || existingAccount?.school;
    const schoolId = existingAccount?.schoolId || currentSchool?.id;
    if (!currentSchool || !schoolId) {
      setBranchError('Create a school profile through the school API before adding a branch.');
      return false;
    }

    try {
      const updatedSchool = await addSchoolBranch(schoolId, branch);
      const updatedAdmin = updatedSchool.primaryAdmin || primaryAdmin || existingAccount?.primaryAdmin;
      saveMockSchoolAccount({
        ...existingAccount,
        schoolId,
        school: updatedSchool,
        primaryAdmin: updatedAdmin,
        requiresPasswordChange: false,
      });
      setSchool(updatedSchool);
      setPrimaryAdmin(updatedAdmin);
      setBranchError('');
      return true;
    } catch (error) {
      setBranchError(error.message);
      return false;
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      <section className="relative overflow-hidden rounded-3xl bg-sidebar p-6 text-white shadow-[0_20px_55px_-35px_rgba(13,47,34,0.75)] sm:p-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              'radial-gradient(circle at 88% 12%, rgba(102,190,137,0.32), transparent 34%), radial-gradient(circle at 5% 100%, rgba(232,244,238,0.08), transparent 38%)',
          }}
        />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mint-strong">
              School overview
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              {school ? `Welcome to ${schoolName}` : `Welcome back, ${user.fullName}`}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
              {school
                ? 'Your school workspace is ready. You can continue setting up your school profile and locations.'
                : 'Your school workspace at a glance. Complete school setup to get your workspace ready.'}
            </p>
          </div>
          {school ? (
            <button
              type="button"
              onClick={() => {
                setIsAddingBranch((open) => !open);
                setBranchError('');
              }}
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-mint-strong px-4 text-sm font-semibold text-forest transition-colors hover:bg-white focus-visible:ring-4 focus-visible:ring-mint-strong/50 focus-visible:outline-none"
            >
              <Plus aria-hidden="true" className="size-4" />
              Add branch
            </button>
          ) : (
            <Link
              to="/onboarding"
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-mint-strong px-4 text-sm font-semibold text-forest transition-colors hover:bg-white focus-visible:ring-4 focus-visible:ring-mint-strong/50 focus-visible:outline-none"
            >
              Onboard school
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          )}
        </div>
        {primaryAdmin ? (
          <div className="relative mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/10 pt-4 text-xs text-white/65">
            <span className="font-semibold text-white">Primary school admin</span>
            <span>{primaryAdmin.name}</span>
            <span>{primaryAdmin.email}</span>
            <span>{primaryAdmin.mobile}</span>
          </div>
        ) : null}
      </section>

      {school?.schoolType === 'multi-branch' ? (
        <section className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-4 shadow-[0_12px_35px_-28px_rgba(13,47,34,0.35)] sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-mint text-forest">
              <Building2 aria-hidden="true" className="size-[18px]" />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-deep">Dashboard view</h2>
              <p className="mt-1 text-xs leading-5 text-muted">
                Choose an individual branch or view school-wide totals and locations.
              </p>
            </div>
          </div>
          <div className="w-full sm:max-w-xs">
            <label htmlFor="branch-scope" className="mb-1.5 block text-xs font-semibold text-deep">
              School / branch
            </label>
            <select
              id="branch-scope"
              value={branchScope}
              onChange={(event) => setBranchScope(event.target.value)}
              className="h-11 w-full rounded-xl border border-line bg-white px-3 text-sm text-ink outline-none transition focus:border-forest focus:ring-4 focus:ring-mint"
            >
              <option value="all">All school · {schoolName}</option>
              {branches.map((branch, index) => (
                <option key={`${branch.name}-${index}`} value={String(index)}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>
        </section>
      ) : null}

      {selectedBranch ? (
        <section
          aria-live="polite"
          className="flex flex-col gap-2 rounded-2xl border border-forest/10 bg-mint/45 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-forest">Branch view</p>
            <h2 className="mt-1 text-base font-semibold text-deep">{selectedBranch.name}</h2>
          </div>
          <p className="text-sm text-muted">
            {[selectedBranch.area, selectedBranch.ward, selectedBranch.subCounty, selectedBranch.county]
              .filter(Boolean)
              .join(', ') || 'Location details not provided'}
          </p>
        </section>
      ) : null}

      <section
        aria-label="School summary"
        className={`grid gap-4 sm:grid-cols-2 ${
          school?.schoolType === 'multi-branch' ? 'xl:grid-cols-4' : 'xl:grid-cols-3'
        }`}
      >
        {visibleMetricCards.map(({ label, value, valueFor, detail, icon: Icon }) => (
          <article
            key={label}
            className="rounded-2xl border border-line bg-white p-5 shadow-[0_12px_35px_-28px_rgba(13,47,34,0.35)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-muted">{label}</p>
                <p className="mt-3 text-3xl font-semibold tracking-tight text-deep">
                  {valueFor === 'branches' ? (selectedBranch ? 1 : branchCount) : value}
                </p>
              </div>
              <span className="flex size-10 items-center justify-center rounded-xl bg-mint text-forest">
                <Icon aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
              </span>
            </div>
            <p className="mt-2 text-xs text-muted">
              {valueFor === 'branches'
                ? selectedBranch
                  ? 'Selected branch'
                  : detail
                : selectedBranch
                  ? `${detail} · ${selectedBranch.name}`
                  : detail}
            </p>
          </article>
        ))}
      </section>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-deep">
                {selectedBranch ? 'Branch location' : 'School locations'}
              </h2>
              <p className="mt-1 text-sm text-muted">
                {selectedBranch
                  ? `Location details for ${selectedBranch.name}.`
                  : 'Your school campuses and their locations.'}
              </p>
            </div>
            <span className="flex size-9 items-center justify-center rounded-xl bg-mint text-forest">
              <MapPin aria-hidden="true" className="size-4" />
            </span>
          </div>

          {displayedBranches.length ? (
            <ul className="mt-5 divide-y divide-line">
              {displayedBranches.map((branch, index) => (
                <li
                  key={`${branch.name}-${index}`}
                  className="flex items-start gap-3 py-4 first:pt-0 last:pb-0"
                >
                  <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-page text-forest">
                    <Building2 aria-hidden="true" className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-deep">{branch.name}</p>
                    <p className="mt-1 text-xs text-muted">
                      {[branch.area, branch.ward, branch.subCounty, branch.county]
                        .filter(Boolean)
                        .join(', ') || 'Location details not provided'}
                    </p>
                    {branch.nearestLandmark ? (
                      <p className="mt-1 text-xs text-muted">
                        Near {branch.nearestLandmark}
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-5 rounded-xl bg-page/80 px-4 py-5 text-sm text-muted">
              No school locations yet.
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
          <h2 className="text-base font-semibold text-deep">Get your workspace ready</h2>
          <p className="mt-1 text-sm text-muted">
            Begin with the school profile. More tools will be available as your workspace grows.
          </p>
          <div className="mt-5 rounded-xl border border-line bg-page/70 p-4">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-xl bg-mint text-forest">
                <School aria-hidden="true" className="size-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-deep">
                  {school
                    ? school.schoolType === 'multi-branch'
                      ? 'Multiple branches'
                      : 'Standalone school'
                    : 'Set up your school'}
                </p>
                <p className="mt-0.5 text-xs text-muted">{schoolName}</p>
              </div>
            </div>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-mint">
              <div
                className="h-full rounded-full bg-forest"
                style={{ width: school ? '100%' : schoolLocation ? '50%' : '0%' }}
              />
            </div>
            <p className="mt-2 text-right text-[11px] font-medium text-muted">
              {school
                ? school.schoolType === 'multi-branch'
                  ? `${branches.length} branches`
                  : 'Standalone school'
                : 'Setup not started'}
            </p>
          </div>
          <Link
            to={school ? '/school/profile' : '/onboarding'}
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent transition-colors hover:text-accent-dark focus-visible:ring-2 focus-visible:ring-mint focus-visible:outline-none"
          >
            {school ? 'Manage school profile' : 'Start school onboarding'}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </section>
      </div>

      {isAddingBranch ? (
        <AddBranchForm
          onAdd={addBranch}
          error={branchError}
          onCancel={() => {
            setIsAddingBranch(false);
            setBranchError('');
          }}
        />
      ) : null}

      <p className="text-center text-xs text-muted">
        Dashboard metrics are placeholders until live school data is connected.
      </p>
    </div>
  );
}
