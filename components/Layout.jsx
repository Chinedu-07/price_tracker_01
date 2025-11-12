import Sidebar from './Sidebar';

export default function Layout({ children, session }) {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
