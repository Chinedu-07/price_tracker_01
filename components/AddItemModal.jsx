import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function AddItemModal({ onClose, session }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);

  const normalize = s => s.trim().toLowerCase();
  const displayFormat = s => s.trim().replace(/\s+/g,' ').replace(/(^.|\s.)/g, c=>c.toUpperCase());

  const handleAdd = async () => {
    if (!name || !price) return alert('Provide name and price');
    setLoading(true);
    const normalized = normalize(name);
    const display = displayFormat(name);

    // check if item exists for this user
    const { data: existing } = await supabase.from('items').select('*').eq('user_id', session.user.id).eq('name_normalized', normalized).maybeSingle();

    if (existing) {
      // update previous/current automatically
      const prev = existing.current_price;
      const { error } = await supabase.from('items').update({ previous_price: prev, current_price: price, updated_at: new Date() }).eq('id', existing.id);
      // also insert history
      await supabase.from('price_history').insert([{ item_id: existing.id, price: price }]);
    } else {
      const { data, error } = await supabase.from('items').insert([{ user_id: session.user.id, name_normalized: normalized, name_display: display, current_price: price, previous_price: null }]).select().single();
      if (data) {
        await supabase.from('price_history').insert([{ item_id: data.id, price: price }]);
      }
    }

    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="bg-white p-6 rounded shadow w-96">
        <h3 className="text-lg font-semibold mb-3">Add Item</h3>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Item name" className="border p-2 w-full mb-3" />
        <input value={price} onChange={e=>setPrice(e.target.value)} placeholder="Price" type="number" className="border p-2 w-full mb-3" />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2">Cancel</button>
          <button onClick={handleAdd} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">{loading? 'Saving...' : 'Save'}</button>
        </div>
      </div>
    </div>
  );
}
