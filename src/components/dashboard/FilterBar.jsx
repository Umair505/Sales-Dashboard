import { Calendar, DollarSign, Mail, Phone, Search } from "lucide-react"

export default function FilterBar({ filters, setFilters }) {
  const handleChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-500 uppercase">Start Date</label>
        <div className="relative">
          <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleChange("startDate", e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-500 uppercase">End Date</label>
        <div className="relative">
          <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleChange("endDate", e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-500 uppercase">Min Price</label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="number"
            placeholder="0"
            value={filters.minPrice}
            onChange={(e) => handleChange("minPrice", e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-500 uppercase">Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="email"
            placeholder="user@example.com"
            value={filters.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-500 uppercase">Phone</label>
        <div className="relative">
          <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="+1234567890"
            value={filters.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  )
}