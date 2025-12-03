import { ArrowUpDown, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export default function SalesTable({ data, isLoading, isFetching, filters, setFilters, paginationState, handlePageChange }) {
  const toggleSort = (column) => {
    const newOrder = filters.sortBy === column && filters.sortOrder === "asc" ? "desc" : "asc"
    setFilters((prev) => ({ ...prev, sortBy: column, sortOrder: newOrder }))
  }

  const SortIcon = ({ column }) => (
    <ArrowUpDown 
      className={cn(
        "ml-2 h-4 w-4 transition-colors",
        filters.sortBy === column ? "text-slate-900" : "text-slate-300"
      )} 
    />
  )

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
    >
      <div className="p-6 border-b border-slate-200 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-slate-900">Recent Transactions</h3>
          {isFetching && !isLoading && (
            <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full flex items-center">
              <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Updating...
            </span>
          )}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold">
            <tr>
              <th 
                className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => toggleSort("date")}
              >
                <div className="flex items-center">Date <SortIcon column="date" /></div>
              </th>
              <th 
                className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => toggleSort("price")}
              >
                <div className="flex items-center">Price <SortIcon column="price" /></div>
              </th>
              <th className="px-6 py-4">Customer Email</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4 text-right">ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-24 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-500">
                    <Loader2 className="h-8 w-8 animate-spin mb-2 text-indigo-600" />
                    <p>Loading transactions...</p>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  No records found matching your filters.
                </td>
              </tr>
            ) : (
              data.map((sale, i) => (
                <motion.tr 
                  key={sale._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {format(new Date(sale.date), "MMM dd, yyyy HH:mm")}
                  </td>
                  <td className="px-6 py-4 font-semibold text-indigo-600">
                    ${sale.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{sale.customerEmail}</td>
                  <td className="px-6 py-4 text-slate-600 font-mono text-xs">{sale.customerPhone}</td>
                  <td className="px-6 py-4 text-right font-mono text-xs text-slate-400">
                    {sale._id.slice(-6)}
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
        <button
          onClick={() => handlePageChange("prev")}
          disabled={paginationState.index === 0 || isLoading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="h-4 w-4" /> Previous
        </button>

        <span className="text-xs font-medium text-slate-400">
          Page {paginationState.index + 1}
        </span>

        <button
          onClick={() => handlePageChange("next")}
          disabled={!paginationState.hasNext || isLoading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Next <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  )
}