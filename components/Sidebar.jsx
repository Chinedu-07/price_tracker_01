import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="w-60 bg-white border-r">
      <div className="p-6"> <h2 className="font-bold text-lg">PriceTracker</h2> </div>
      <nav className="p-4">
        <Link href="/" className="block py-2">Dashboard</Link>
        <Link href="/settings" className="block py-2">Settings</Link>
      </nav>
    </aside>
  );
}
