import { useState } from 'react';
import {
  ArrowDown,
  ClipboardList,
  FileClock,
  LayoutGrid,
  School,
  Sparkles,
  UsersRound,
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '../../lib/cn.js';

const navigationGroups = [
  {
    label: 'Platform',
    items: [
      {
        label: 'School',
        icon: School,
        children: [
          { label: 'School profile', to: '/school/profile', icon: School },
          { label: 'School directory', to: '/school/directory', icon: ClipboardList },
          { label: 'School onboarding', to: '/onboarding', icon: Sparkles },
        ],
      },
    ],
  },
  {
    label: 'Learning',
    items: [{ label: 'Admissions', icon: ClipboardList, disabled: true }],
  },
  {
    label: 'Administration',
    items: [
      { label: 'User directory', icon: UsersRound, disabled: true },
      { label: 'Audit logs', icon: FileClock, disabled: true },
    ],
  },
];

function SidebarLink({ label, to, icon: Icon, disabled = false }) {
  const className = ({ isActive = false } = {}) =>
    cn(
      'group relative flex min-h-10 min-w-fit items-center gap-3 border-l-2 px-3 py-2 text-left text-[13px] font-semibold transition-colors duration-150 focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-mint-strong focus-visible:outline-none md:min-w-0',
      isActive
        ? 'border-mint-strong bg-white/[0.1] text-white'
        : 'border-transparent text-white/65 hover:bg-white/[0.06] hover:text-white',
    );

  if (disabled) {
    return (
      <span
        aria-disabled="true"
        className={cn(className({}), 'cursor-not-allowed opacity-60')}
        title={`${label} is not available yet`}
      >
        <Icon
          aria-hidden="true"
          className="size-[17px] shrink-0 text-mint-strong/70"
          strokeWidth={1.8}
        />
        <span className="truncate">{label}</span>
      </span>
    );
  }

  return (
    <NavLink to={to} end={to === '/'} className={className}>
      {({ isActive }) => (
        <>
          <Icon
            aria-hidden="true"
            className={cn(
              'size-[17px] shrink-0 transition-colors',
              isActive ? 'text-mint-strong' : 'text-mint-strong/70 group-hover:text-mint-strong',
            )}
            strokeWidth={1.8}
          />
          <span className="truncate">{label}</span>
        </>
      )}
    </NavLink>
  );
}

export function Sidebar() {
  const [schoolMenuExpanded, setSchoolMenuExpanded] = useState(false);
  const { pathname } = useLocation();
  const schoolMenuOpen = schoolMenuExpanded || pathname === '/onboarding' || pathname.startsWith('/school/');
  const isSchoolProfile = pathname === '/school/profile';

  return (
    <aside
      className={cn(
        'relative overflow-hidden bg-sidebar text-white md:col-start-1 md:row-start-2',
        isSchoolProfile && 'md:sticky md:top-[4.5rem] md:h-[calc(100vh-4.5rem)] md:self-start',
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden opacity-50 md:block"
        style={{
          background:
            'radial-gradient(circle at 8% 0%, rgba(102,190,137,0.2), transparent 34%), radial-gradient(circle at 100% 100%, rgba(232,244,238,0.08), transparent 34%)',
        }}
      />
      <nav
        aria-label="Main navigation"
        className={cn(
          'relative flex gap-3 overflow-x-auto p-2.5 md:h-full md:flex-col md:gap-5 md:overflow-x-hidden md:px-2.5 md:py-4',
          isSchoolProfile ? 'md:overflow-y-hidden' : 'md:overflow-y-auto',
        )}
      >
        <SidebarLink label="Overview" to="/overview" icon={LayoutGrid} />

        {navigationGroups.map((group) => (
          <section key={group.label} className="shrink-0 md:shrink">
            <h2 className="hidden px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-mint-strong/65 md:block">
              {group.label}
            </h2>
            <div className="flex gap-1 md:flex-col">
              {group.items.map((item) =>
                item.children ? (
                  <div key={item.label}>
                    <button
                      type="button"
                      aria-expanded={schoolMenuOpen}
                      aria-controls="school-subnavigation"
                      onClick={() => setSchoolMenuExpanded((expanded) => !expanded)}
                      className={cn(
                        'group relative flex min-h-10 min-w-fit w-full items-center gap-3 border-l-2 px-3 py-2 text-left text-[13px] font-semibold transition-colors duration-150 focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-mint-strong focus-visible:outline-none md:min-w-0',
                        schoolMenuOpen
                          ? 'border-mint-strong bg-white/[0.1] text-white'
                          : 'border-transparent text-white/65 hover:bg-white/[0.06] hover:text-white',
                      )}
                    >
                      <item.icon
                        aria-hidden="true"
                        className={cn(
                          'size-[17px] shrink-0 transition-colors',
                          schoolMenuOpen
                            ? 'text-mint-strong'
                            : 'text-mint-strong/70 group-hover:text-mint-strong',
                        )}
                        strokeWidth={1.8}
                      />
                      <span className="flex-1 truncate">{item.label}</span>
                      <ArrowDown
                        aria-hidden="true"
                        className={cn(
                          'size-3.5 shrink-0 text-white/50 transition-transform duration-200',
                          schoolMenuOpen && 'rotate-180 text-mint-strong',
                        )}
                      />
                    </button>
                    {schoolMenuOpen ? (
                      <div
                        id="school-subnavigation"
                        className="ml-5 border-l border-white/10 py-1 pl-2"
                      >
                        {item.children.map((child) => (
                          <SidebarLink key={child.label} {...child} />
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <SidebarLink key={item.label} {...item} />
                ),
              )}
            </div>
          </section>
        ))}
      </nav>
    </aside>
  );
}
