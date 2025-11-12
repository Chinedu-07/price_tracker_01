import SettingsForm from '../components/SettingsForm';

export default function Settings({ session }) {
  if (!session) return <div>Please sign in</div>;
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Settings</h1>
      <SettingsForm session={session} />
    </div>
  );
}
