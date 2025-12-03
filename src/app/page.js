"use client"

import { useEffect, useState } from "react"
import { Loader2, AlertCircle, ArrowUp } from "lucide-react"
import FilterBar from "@/components/dashboard/FilterBar"
import SalesChart from "@/components/dashboard/SalesChart"
import SalesTable from "@/components/dashboard/SalesTable"
import { useSalesData } from "@/hooks/useSalesData"

function DashboardContent() {
  const [filters, setFilters] = useState({
    startDate: "2025-01-01",
    endDate: "2025-01-24",
    minPrice: "",
    email: "",
    phone: "",
    sortBy: "date",
    sortOrder: "asc",
  })

  const [pageHistory, setPageHistory] = useState([{}])
  const [currentIndex, setCurrentIndex] = useState(0)

  const currentCursor = pageHistory[currentIndex]

  const { sales, totalSales, apiPagination, isLoading, isFetching, isError } = useSalesData(filters, currentCursor)

  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true)
      } else {
        setShowScrollTop(false)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }
  const handlePageChange = (direction) => {
    if (direction === "next" && apiPagination.after) {
      const nextCursor = { after: apiPagination.after }
      const newHistory = pageHistory.slice(0, currentIndex + 1)
      newHistory.push(nextCursor)
      setPageHistory(newHistory)
      setCurrentIndex(newHistory.length - 1)
    } 
    else if (direction === "prev" && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }
  }

  const handleFilterChange = (updater) => {
    setPageHistory([{}])
    setCurrentIndex(0)
    setFilters(updater)
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
        
        {isError ? (
          <div className="p-6 bg-red-50 border border-red-200 rounded-xl flex flex-col items-center justify-center text-center py-12">
            <div className="bg-red-100 p-3 rounded-full mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-red-900 mb-2">Failed to load data</h3>
            <p className="text-red-600 max-w-md">
              We couldn't fetch the data for the selected date range. Please try selecting a different date or check your connection.
            </p>
          </div>
        ) : (
          <>
            <SalesChart data={totalSales} />
            
            <SalesTable 
              data={sales} 
              isLoading={isLoading}
              isFetching={isFetching}
              filters={filters} 
              setFilters={handleFilterChange}
              paginationState={{
                index: currentIndex,
                hasNext: !!apiPagination.after
              }}
              handlePageChange={handlePageChange}
            />
          </>
        )}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}
      </div>
    </main>
  )
}

export default function DashboardPage() {
  return (
      <DashboardContent />
  )
}