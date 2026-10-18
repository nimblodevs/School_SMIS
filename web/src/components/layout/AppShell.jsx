import { Outlet } from 'react-router-dom';
import { Footer } from './footer.jsx';
import { Navbar } from './navbar.jsx';
import { Sidebar } from './sidebar.jsx';

export function AppShell() {
  return (
    <div className="mx-auto grid min-h-screen w-full max-w-screen-2xl grid-cols-1 grid-rows-[auto_auto_1fr_auto] bg-page md:grid-cols-[17rem_minmax(0,1fr)] md:grid-rows-[auto_1fr_auto]">
      <Navbar />
      <Sidebar />
      <main className="min-w-0 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
