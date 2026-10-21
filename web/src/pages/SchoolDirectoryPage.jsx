import { useEffect, useState } from 'react';
import { ArrowDownUp, ArrowRight, Building2, ChevronLeft, ChevronRight, MapPin, Plus, Search, School as SchoolIcon, SlidersHorizontal, UsersRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getMockSchoolAccount } from '../lib/mockSchoolAccount.js';
import { ensureSchoolApiRecord, listSchools } from '../lib/schoolApi.js';

const PAGE_SIZE_OPTIONS = [10, 25, 50];

function getLocations(school) {
  return school.schoolType === 'multi-branch' ? school.branches || [] : school.schoolLocation ? [{ name: school.schoolName, ...school.schoolLocation }] : [];
}

function getLocationLabel(school) {
  const locations = getLocations(school);
  const firstLocation = locations[0];
  if (!firstLocation) return 'Location not provided';
  return [firstLocation.area, firstLocation.county].filter(Boolean).join(', ') || 'Location not provided';
}

function Pagination({ page, pageCount, onPageChange }) {
  const pages =
    pageCount <= 5
      ? Array.from({ length: pageCount }, (_, index) => index + 1)
      : [
          1,
          ...(page > 3 ? ['start-gap'] : []),
          ...Array.from({ length: Math.min(3, pageCount - Math.max(2, page - 1)) }, (_, index) => Math.max(2, page - 1) + index),
          ...(page < pageCount - 2 ? ['end-gap'] : []),
          pageCount,
        ];

  return (
    <nav aria-label="School directory pages" className="flex items-center justify-between gap-3">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-line bg-white px-3 text-xs font-semibold text-deep transition hover:bg-page focus-visible:ring-2 focus-visible:ring-forest focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft aria-hidden="true" className="size-4" />
        <span className="hidden sm:inline">Previous</span>
      </button>
      <div className="flex items-center gap-1" aria-label={`Page ${page} of ${pageCount}`}>
        {pages.map((pageNumber) =>
          typeof pageNumber === 'string' ? (
            <span key={pageNumber} aria-hidden="true" className="grid size-7 place-items-center text-xs text-muted">
              …
            </span>
          ) : (
            <button
              key={pageNumber}
              type="button"
              aria-label={`Go to page ${pageNumber}`}
              aria-current={pageNumber === page ? 'page' : undefined}
              onClick={() => onPageChange(pageNumber)}
              className={`grid size-9 place-items-center rounded-xl text-xs font-semibold transition focus-visible:ring-2 focus-visible:ring-forest focus-visible:outline-none ${
                pageNumber === page ? 'bg-forest text-white shadow-sm' : 'text-muted hover:bg-page hover:text-deep'
              }`}
            >
              {pageNumber}
            </button>
          ),
        )}
      </div>
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= pageCount}
        className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-line bg-white px-3 text-xs font-semibold text-deep transition hover:bg-page focus-visible:ring-2 focus-visible:ring-forest focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight aria-hidden="true" className="size-4" />
      </button>
    </nav>
  );
}

function SchoolAvatar({ name, logoDataUrl }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');

  return (
    <span className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-2xl bg-mint text-sm font-bold text-forest">
      {logoDataUrl ? (
        <img src={logoDataUrl} alt={`${name} logo`} className="size-full bg-white object-contain p-1" />
      ) : (
        initials || <SchoolIcon aria-hidden="true" className="size-5" />
      )}
    </span>
  );
}

export function SchoolDirectoryPage() {
  const account = getMockSchoolAccount();
  const [search, setSearch] = useState('');
  const [schoolType, setSchoolType] = useState('all');
  const [ownershipType, setOwnershipType] = useState('all');
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [page, setPage] = useState(1);
  const [sortAscending, setSortAscending] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const schools = result?.data?.schools || [];
  const filteredCount = result?.data?.total || 0;
  const pageCount = Math.max(1, result?.data?.totalPages || 1);
  const currentPage = result?.data?.page || page;
  const firstIndex = filteredCount ? (currentPage - 1) * pageSize : 0;
  const endIndex = Math.min(firstIndex + schools.length, filteredCount);
  const pageSchools = schools;
  const summary = result?.data?.summary || {
    registeredSchools: 0,
    multiBranchSchools: 0,
  };

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => {
      setLoading(true);
      setLoadError('');
      ensureSchoolApiRecord()
        .then(() =>
          listSchools({
            page,
            pageSize,
            search,
            schoolType,
            ownershipType,
            sort: sortAscending ? 'asc' : 'desc',
            signal: controller.signal,
          }),
        )
        .then((response) => setResult(response))
        .catch((error) => {
          if (error.name !== 'AbortError') setLoadError(error.message);
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    }, 200);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [page, pageSize, search, schoolType, ownershipType, sortAscending, reloadKey]);

  const profileTarget = account?.schoolId || schools[0]?.id;

  const updateSearch = (value) => {
    setSearch(value);
    setPage(1);
  };
  const updateType = (value) => {
    setSchoolType(value);
    setPage(1);
  };
  const updateOwnershipType = (value) => {
    setOwnershipType(value);
    setPage(1);
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-7">
      <header className="relative isolate overflow-hidden rounded-[2rem] bg-sidebar text-white shadow-[0_25px_65px_-40px_rgba(13,47,34,0.8)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-80"
          style={{
            background:
              'radial-gradient(circle at 86% 5%, rgba(102,190,137,0.34), transparent 34%), radial-gradient(circle at 5% 110%, rgba(232,244,238,0.1), transparent 38%)',
          }}
        />
        <div className="flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-mint-strong">School management</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">School directory</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-white/65">Browse, search, and manage registered school workspaces from one place.</p>
          </div>
          <Link
            to={profileTarget ? `/school/profile?schoolId=${encodeURIComponent(profileTarget)}` : '/onboarding'}
            className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl bg-mint-strong px-4 text-sm font-semibold text-forest transition hover:bg-white focus-visible:ring-4 focus-visible:ring-mint-strong/50 focus-visible:outline-none lg:self-auto"
          >
            {profileTarget ? (
              <>
                <SchoolIcon aria-hidden="true" className="size-4" />
                Manage school
              </>
            ) : (
              <>
                <Plus aria-hidden="true" className="size-4" />
                Add a school
              </>
            )}
          </Link>
        </div>
      </header>

      <section aria-label="Directory statistics" className="grid gap-3 sm:grid-cols-3">
        {[
          {
            label: 'Registered schools',
            value: summary.registeredSchools,
            icon: SchoolIcon,
          },
          {
            label: 'Multi-branch',
            value: summary.multiBranchSchools,
            icon: Building2,
          },
          { label: 'Matching results', value: filteredCount, icon: Search },
        ].map(({ label, value, icon: Icon }) => (
          <article key={label} className="flex items-center gap-4 rounded-2xl border border-line bg-white p-4 shadow-[0_12px_35px_-28px_rgba(13,47,34,0.35)]">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-mint text-forest">
              <Icon aria-hidden="true" className="size-[18px]" />
            </span>
            <div>
              <p className="text-[11px] font-semibold text-muted">{label}</p>
              <p className="mt-0.5 text-xl font-semibold tracking-tight text-deep">{value.toLocaleString()}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="overflow-hidden rounded-3xl border border-line bg-white shadow-[0_18px_50px_-38px_rgba(13,47,34,0.45)]">
        <div className="border-b border-line p-5 sm:p-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-base font-semibold text-deep">All schools</h2>
              <p className="mt-1 text-xs text-muted">Search by school name, code, administrator, or location.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(15rem,1fr)_auto_auto] xl:min-w-[42rem]">
              <label className="relative block">
                <span className="sr-only">Search school directory</span>
                <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" />
                <input
                  id="school-directory-search"
                  type="search"
                  value={search}
                  onChange={(event) => updateSearch(event.target.value)}
                  placeholder="Search schools..."
                  className="h-11 w-full rounded-xl border border-line bg-page/50 pr-4 pl-10 text-sm text-ink outline-none transition placeholder:text-muted/80 focus:border-forest focus:bg-white focus:ring-4 focus:ring-mint"
                />
              </label>
              <label className="relative">
                <span className="sr-only">Filter school type</span>
                <SlidersHorizontal aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
                <select
                  id="school-type-filter"
                  value={schoolType}
                  onChange={(event) => updateType(event.target.value)}
                  className="h-11 w-full appearance-none rounded-xl border border-line bg-white py-0 pr-9 pl-9 text-xs font-semibold text-deep outline-none transition focus:border-forest focus:ring-4 focus:ring-mint sm:w-48"
                >
                  <option value="all">All school types</option>
                  <option value="standalone">Standalone</option>
                  <option value="multi-branch">Multi-branch</option>
                </select>
              </label>
              <label className="relative">
                <span className="sr-only">Filter ownership type</span>
                <UsersRound aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
                <select
                  id="ownership-type-filter"
                  value={ownershipType}
                  onChange={(event) => updateOwnershipType(event.target.value)}
                  className="h-11 w-full appearance-none rounded-xl border border-line bg-white py-0 pr-9 pl-9 text-xs font-semibold text-deep outline-none transition focus:border-forest focus:ring-4 focus:ring-mint sm:col-span-2 xl:col-span-1 xl:w-40"
                >
                  <option value="all">All ownership</option>
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </label>
            </div>
          </div>
        </div>

        {loading ? (
          <div role="status" className="px-5 py-14 text-center text-sm text-muted">
            Loading schools…
          </div>
        ) : loadError ? (
          <div className="px-5 py-14 text-center">
            <h3 className="text-base font-semibold text-deep">School directory unavailable</h3>
            <p role="alert" className="mx-auto mt-2 max-w-lg text-sm leading-6 text-error">
              {loadError}
            </p>
            <button
              type="button"
              onClick={() => setReloadKey((current) => current + 1)}
              className="mt-4 inline-flex h-9 items-center rounded-xl border border-line px-3 text-xs font-semibold text-forest hover:bg-mint focus-visible:ring-2 focus-visible:ring-forest focus-visible:outline-none"
            >
              Retry
            </button>
          </div>
        ) : pageSchools.length ? (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <thead>
                  <tr className="bg-page/60">
                    <th scope="col" className="px-6 py-3">
                      <button
                        type="button"
                        onClick={() => setSortAscending((ascending) => !ascending)}
                        className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-muted hover:text-deep focus-visible:ring-2 focus-visible:ring-forest focus-visible:outline-none"
                      >
                        School <ArrowDownUp aria-hidden="true" className="size-3" />
                      </button>
                    </th>
                    <th scope="col" className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
                      Location
                    </th>
                    <th scope="col" className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
                      Primary admin
                    </th>
                    <th scope="col" className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
                      Structure
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/70">
                  {pageSchools.map((school) => {
                    const primaryAdmin = school.primaryAdmin;
                    const locations = getLocations(school);
                    return (
                      <tr key={school.id} className="transition-colors hover:bg-page/50">
                        <th scope="row" className="px-6 py-4 font-normal">
                          <div className="flex min-w-0 items-center gap-3">
                            <SchoolAvatar name={school.schoolName || 'School'} logoDataUrl={school.logoUrl} />
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-deep">{school.schoolName}</p>
                              <p className="mt-1 text-xs text-muted">
                                {school.schoolCode} · {school.schoolEmail}
                              </p>
                            </div>
                          </div>
                        </th>
                        <td className="px-4 py-4">
                          <div className="flex items-start gap-2 text-xs text-deep">
                            <MapPin aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-forest" />
                            <span>
                              <span className="block">{getLocationLabel(school)}</span>
                              <span className="mt-1 block text-[11px] text-muted">
                                {school.schoolType === 'multi-branch' ? `${locations.length} branches` : '1 location'}
                              </span>
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-xs font-semibold text-deep">{primaryAdmin?.name || 'Not provided'}</p>
                          <p className="mt-1 max-w-48 truncate text-[11px] text-muted">{primaryAdmin?.email || 'No admin email'}</p>
                        </td>
                        <td className="px-4 py-4">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-mint/60 px-2.5 py-1 text-[10px] font-semibold text-forest">
                            <span className="size-1.5 rounded-full bg-forest" />
                            {school.schoolType === 'multi-branch' ? 'Multi-branch' : 'Standalone'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {school.canManage ? (
                            <Link
                              to={`/school/profile?schoolId=${encodeURIComponent(school.id)}`}
                              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line bg-white px-3 text-xs font-semibold text-accent transition hover:border-accent/30 hover:bg-mint/50 hover:text-accent-dark focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
                            >
                              Manage <ArrowRight aria-hidden="true" className="size-3.5" />
                            </Link>
                          ) : (
                            <span aria-label="No access" className="text-xs text-muted">
                              —
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <ul className="divide-y divide-line/70 md:hidden">
              {pageSchools.map((school) => {
                const primaryAdmin = school.primaryAdmin;
                const locations = getLocations(school);
                return (
                  <li key={school.id} className="space-y-4 p-4">
                    <div className="flex items-start gap-3">
                      <SchoolAvatar name={school.schoolName || 'School'} logoDataUrl={school.logoUrl} />
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-semibold text-deep">{school.schoolName}</h3>
                        <p className="mt-1 text-xs text-muted">
                          {school.schoolCode} · {school.schoolEmail}
                        </p>
                        <span className="mt-2 inline-flex rounded-full bg-mint/60 px-2.5 py-1 text-[10px] font-semibold text-forest">
                          {school.schoolType === 'multi-branch' ? 'Multi-branch' : 'Standalone'}
                        </span>
                      </div>
                      {school.canManage ? (
                        <Link
                          to={`/school/profile?schoolId=${encodeURIComponent(school.id)}`}
                          aria-label={`Manage ${school.schoolName}`}
                          className="grid size-9 shrink-0 place-items-center rounded-xl border border-line text-accent hover:bg-mint hover:text-accent-dark focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
                        >
                          <ArrowRight aria-hidden="true" className="size-4" />
                        </Link>
                      ) : null}
                    </div>
                    <div className="grid gap-3 rounded-xl bg-page/70 p-3 text-xs sm:grid-cols-2">
                      <p className="flex items-start gap-2 text-deep">
                        <MapPin aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-forest" />
                        <span>
                          {getLocationLabel(school)} · {school.schoolType === 'multi-branch' ? `${locations.length} branches` : '1 location'}
                        </span>
                      </p>
                      <p className="flex items-start gap-2 text-deep">
                        <UsersRound aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-forest" />
                        <span>
                          {primaryAdmin?.name || 'Admin not provided'}
                          <span className="mt-0.5 block break-all text-[11px] text-muted">{primaryAdmin?.email || 'No admin email'}</span>
                        </span>
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        ) : (
          <div className="px-5 py-14 text-center sm:py-16">
            <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-page text-muted">
              <SchoolIcon aria-hidden="true" className="size-6" />
            </span>
            <h3 className="mt-4 text-base font-semibold text-deep">{summary.registeredSchools ? 'No matching schools' : 'No schools registered yet'}</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
              {summary.registeredSchools
                ? 'Try a different search or school type filter.'
                : 'Create a school profile to get started. It will appear in this directory after onboarding.'}
            </p>
            {!summary.registeredSchools ? (
              <Link
                to="/onboarding"
                className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-forest px-4 text-sm font-semibold text-white hover:bg-forest-dark focus-visible:ring-4 focus-visible:ring-mint focus-visible:outline-none"
              >
                <Plus aria-hidden="true" className="size-4" />
                Start school onboarding
              </Link>
            ) : null}
          </div>
        )}

        <footer className="flex flex-col gap-4 border-t border-line bg-page/40 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
            <p aria-live="polite" className="text-xs text-muted">
              Showing{' '}
              <span className="font-semibold text-deep">
                {filteredCount ? firstIndex + 1 : 0}–{endIndex}
              </span>{' '}
              of <span className="font-semibold text-deep">{filteredCount.toLocaleString()}</span> schools
            </p>
            <label className="flex items-center gap-2 text-xs text-muted">
              Rows per page
              <select
                id="school-page-size"
                value={pageSize}
                onChange={(event) => {
                  setPageSize(Number(event.target.value));
                  setPage(1);
                }}
                className="h-8 rounded-lg border border-line bg-white px-2 text-xs font-semibold text-deep outline-none focus:border-forest focus:ring-2 focus:ring-mint"
              >
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {filteredCount > 0 ? (
            <Pagination page={currentPage} pageCount={pageCount} onPageChange={(nextPage) => setPage(Math.min(Math.max(nextPage, 1), pageCount))} />
          ) : (
            <span className="text-[11px] text-muted">No pages to display</span>
          )}
        </footer>
      </section>

      <p className="text-center text-[11px] text-muted">School records are loaded from the configured school API.</p>
    </div>
  );
}
