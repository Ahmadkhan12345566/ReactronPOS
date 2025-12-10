export default function SelectFilters({ 
  statusFilter, 
  statusOptions = [], 
  setStatusFilter,
  placeholder = "Status"
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{placeholder}</label>
        <select
          className="w-full md:w-40 px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          {statusOptions.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>
    </div>
  );
}