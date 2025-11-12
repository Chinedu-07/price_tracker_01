import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function SettingsForm({ session, onProfileUpdated }) {
  const [name, setName] = useState(session?.user?.user_metadata?.full_name ?? '');
  const [email, setEmail] = useState(session?.user?.email ?? '');

  const save = async () => {
    // update user metadata
    const updates = { full_name: name };
    const { data, error } = await supabase.auth.updateUser({ data: updates, email });
    if (error) return alert(error.message);
    alert('Saved — check email if you changed it (verification may be required)');
    if (onProfileUpdated) onProfileUpdated();
  };

  return (
    <div className="bg-white p-6 rounded shadow w-full max-w-xl">
      <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
      <label className="block mb-2">Full name</label>
      <input value={name} onChange={e=>setName(e.target.value)} className="border p-2 mb-3 w-full" />
      <label className="block mb-2">Email</label>
      <input value={email} onChange={e=>setEmail(e.target.value)} className="border p-2 mb-3 w-full" />
      <div className="flex gap-2 justify-end">
        <button onClick={save} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
      </div>
    </div>
  );
}
