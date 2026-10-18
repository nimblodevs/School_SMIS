import { Outlet } from 'react-router-dom';

export function AuthShell() {
  return (
    <main className="flex min-h-svh w-full items-center justify-center bg-[radial-gradient(ellipse_at_top,rgba(232,244,238,0.55),transparent_55%),#f8faf8]">
      <Outlet />
    </main>
  );
}
