import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import AddItemModal from '../components/AddItemModal';
import ItemTable from '../components/ItemTable';

export default function Dashboard({ session }) {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const fetchItems = async () => {
    if (!session) return;
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('user_id', session.user.id)
      .order('updated_at', { ascending: false });
    if (!error) setItems(data ?? []);
  };

  useEffect(() => { fetchItems(); }, [session]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div>
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search item" className="border rounded p-2 mr-2" />
          <button onClick={()=>setShowAdd(true)} className="bg-blue-600 text-white px-4 py-2 rounded">Add Item</button>
        </div>
      </div>

      <ItemTable items={items.filter(i=> i.name_display.toLowerCase().includes(query.toLowerCase()))} refresh={fetchItems} />

      {showAdd && <AddItemModal onClose={()=>{ setShowAdd(false); fetchItems(); }} session={session} />}
    </div>
  );
}
