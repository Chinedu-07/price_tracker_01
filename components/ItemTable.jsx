import { supabase } from '../lib/supabaseClient';

export default function ItemTable({ items = [], refresh }) {
  const handleDelete = async (id) => {
    if (!confirm('Delete item?')) return;
    await supabase.from('items').update({ is_deleted: true, updated_at: new Date() }).eq('id', id);
    if (refresh) refresh();
  };

  const calcDiff = (cur, prev) => {
    if (!prev) return '-';
    const diff = Number(cur) - Number(prev);
    const pct = (diff / Number(prev)) * 100;
    return { diff: diff.toFixed(2), pct: pct.toFixed(2) };
  };

  return (
    <div className="bg-white rounded shadow overflow-hidden">
      <table className="min-w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Item</th>
            <th className="p-3">Current</th>
            <th className="p-3">Previous</th>
            <th className="p-3">Difference</th>
            <th className="p-3">% Change</th>
            <th className="p-3">Last Updated</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map(i => {
            const res = calcDiff(i.current_price, i.previous_price);
            const color = res === '-' ? 'text-gray-500' : (Number(res.diff) < 0 ? 'text-green-600' : 'text-red-600');
            return (
              <tr key={i.id} className="border-t">
                <td className="p-3">{i.name_display}</td>
                <td className="p-3">{i.current_price}</td>
                <td className="p-3">{i.previous_price ?? '-'}</td>
                <td className={`p-3 ${color}`}>{res === '-' ? '-' : res.diff}</td>
                <td className={`p-3 ${color}`}>{res === '-' ? '-' : res.pct + '%'}</td>
                <td className="p-3">{new Date(i.updated_at || i.created_at).toLocaleString()}</td>
                <td className="p-3"><button onClick={()=>handleDelete(i.id)} className="text-sm text-red-500">Delete</button></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
