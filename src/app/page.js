"use client"

import React, { useState, useEffect } from "react"
import { 
  useQuery, 
  QueryClient, 
  QueryClientProvider 
} from "@tanstack/react-query"
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from "recharts"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { 
  Calendar, 
  DollarSign, 
  Mail, 
  Phone, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  Loader2 
} from "lucide-react"

// --- 1. UTILITY & HELPERS ---

function cn(...classes) {
  return classes.filter(Boolean).join(" ")
}

// --- 2. DATA HOOK WITH CACHING ---

function useSalesData(filters, cursor) {
  const [token, setToken] = useState(null)

  // 1. Get Token on Mount
  useEffect(() => {
    const fetchToken = async () => {
      // Check if we already have a token in sessionStorage to avoid unnecessary calls
      const cachedToken = typeof window !== 'undefined' ? sessionStorage.getItem('auth_token') : null
      if (cachedToken) {
        setToken(cachedToken)
        return
      }

      try {
        const res = await fetch("https://autobizz-425913.uc.r.appspot.com/getAuthorize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tokenType: "frontEndTest" }),
        })
        const data = await res.json()
        if (data.token) {
          setToken(data.token)
          sessionStorage.setItem('auth_token', data.token)
        }
      } catch (error) {
        console.error("Auth Error:", error)
      }
    }
    fetchToken()
  }, [])

  // 2. React Query for Data Fetching
  const { data, isLoading, isError, isFetching } = useQuery({
    // Query Key includes filters and cursor. 
    // If we go back to a previous cursor, this Key matches the cache!
    queryKey: ["sales", filters, cursor], 
    
    queryFn: async () => {
      if (!token) return null
      
      const params = new URLSearchParams({
        startDate: filters.startDate,
        endDate: filters.endDate,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        priceMin: filters.minPrice,
        email: filters.email,
        phone: filters.phone,
      })

      // Add cursor params if they exist
      if (cursor.after) params.append("after", cursor.after)
      if (cursor.before) params.append("before", cursor.before)

      const res = await fetch(`https://autobizz-425913.uc.r.appspot.com/sales?${params.toString()}`, {
        headers: {
          "X-AUTOBIZZ-TOKEN": token,
        },
      })

      if (!res.ok) throw new Error("Failed to fetch")
      return res.json()
    },
    // Only run if we have a token
    enabled: !!token,
    // CACHING STRATEGY:
    keepPreviousData: true, // Keep showing old data while fetching new
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes (Instant Load on Back)
  })

  return {
    sales: data?.results?.Sales || [],
    totalSales: data?.results?.TotalSales || [],
    apiPagination: data?.pagination || { before: "", after: "" },
    isLoading: isLoading && !data, // Only show full loader on initial load
    isFetching, // True during background refetch
    isError,
  }
}

// --- 3. UI COMPONENTS ---

function FilterBar({ filters, setFilters }) {
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
            placeholder="+123..."
            value={filters.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  )
}

function SalesChart({ data }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm"
    >
      <h3 className="text-lg font-bold text-slate-900 mb-6">Sales Overview</h3>
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis 
              dataKey="day" 
              tickFormatter={(str) => format(new Date(str), "MMM dd")}
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e2e8f0" }}
              itemStyle={{ color: "#1e293b" }}
              formatter={(value) => [`$${value}`, "Total Sales"]}
              labelFormatter={(label) => format(new Date(label), "MMMM dd, yyyy")}
            />
            <Area 
              type="monotone" 
              dataKey="totalSale" 
              stroke="#4f46e5" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorSales)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}

function SalesTable({ data, isLoading, isFetching, filters, setFilters, paginationState, handlePageChange }) {
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

      {/* Pagination Controls */}
      <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
        <button
          onClick={() => handlePageChange("prev")}
          // Disable if we are at index 0 (First Page)
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
          // Disable if API says no 'after' token
          disabled={!paginationState.hasNext || isLoading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Next <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  )
}

// --- 4. MAIN CONTAINER ---

function DashboardContent() {
  const [filters, setFilters] = useState({
    startDate: "2025-01-01",
    endDate: "2025-01-01",
    minPrice: "",
    email: "",
    phone: "",
    sortBy: "date",
    sortOrder: "asc",
  })

  // We maintain a history of cursors to support "Instant" back navigation
  // Index 0 = Initial Page (cursor: {})
  // Index 1 = Page 2 (cursor: { after: '...' })
  const [pageHistory, setPageHistory] = useState([{}])
  const [currentIndex, setCurrentIndex] = useState(0)

  // Current cursor to fetch is determined by the currentIndex
  const currentCursor = pageHistory[currentIndex]

  const { sales, totalSales, apiPagination, isLoading, isFetching, isError } = useSalesData(filters, currentCursor)

  const handlePageChange = (direction) => {
    if (direction === "next" && apiPagination.after) {
      // Create new cursor for next page
      const nextCursor = { after: apiPagination.after }
      
      // If we are moving forward to a new page we haven't seen, push it
      // If we are in history (e.g. went back then forward), we update the path
      const newHistory = pageHistory.slice(0, currentIndex + 1)
      newHistory.push(nextCursor)
      
      setPageHistory(newHistory)
      setCurrentIndex(newHistory.length - 1)
    } 
    else if (direction === "prev" && currentIndex > 0) {
      // Just move the index back. 
      // This will cause useQuery to use the OLD cursor (e.g. {}).
      // Since it's cached, it loads INSTANTLY.
      setCurrentIndex((prev) => prev - 1)
    }
  }

  const handleFilterChange = (updater) => {
    // Reset pagination history on filter change
    setPageHistory([{}])
    setCurrentIndex(0)
    setFilters(updater)
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-red-600">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
          <p>Failed to load dashboard data. Please check your connection.</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Sales Analytics</h1>
            <p className="text-slate-500 mt-1">Real-time insights and transaction history.</p>
          </div>
          {isLoading && (
            <div className="flex items-center text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Syncing Data...
            </div>
          )}
        </header>

        <FilterBar filters={filters} setFilters={handleFilterChange} />
        
        <SalesChart data={totalSales} />
        
        <SalesTable 
          data={sales} 
          isLoading={isLoading}
          isFetching={isFetching}
          filters={filters} 
          setFilters={handleFilterChange}
          // Pass derived state for UI
          paginationState={{
            index: currentIndex,
            hasNext: !!apiPagination.after
          }}
          handlePageChange={handlePageChange}
        />
      </div>
    </main>
  )
}

// --- 5. PROVIDER WRAPPER ---

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Don't refetch on window focus
      retry: 1,
    },
  },
})

export default function DashboardPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <DashboardContent />
    </QueryClientProvider>
  )
}