import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"

export function useSalesData(filters, pagination) {
  const [token, setToken] = useState(null)

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const res = await fetch("https://autobizz-425913.uc.r.appspot.com/getAuthorize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tokenType: "frontEndTest" }),
        })
        const data = await res.json()
        if (data.token) setToken(data.token)
      } catch (error) {
        console.error(error)
      }
    }
    fetchToken()
  }, [])

  const { data, isLoading, isError } = useQuery({
    queryKey: ["sales", token, filters, pagination],
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

      if (pagination.after) params.append("after", pagination.after)
      if (pagination.before) params.append("before", pagination.before)

      const res = await fetch(`https://autobizz-425913.uc.r.appspot.com/sales?${params.toString()}`, {
        headers: {
          "X-AUTOBIZZ-TOKEN": token,
        },
      })

      if (!res.ok) throw new Error("Failed to fetch")
      return res.json()
    },
    enabled: !!token,
    keepPreviousData: true,
  })

  return {
    sales: data?.results?.Sales || [],
    totalSales: data?.results?.TotalSales || [],
    pagination: data?.pagination || { before: "", after: "" },
    isLoading: isLoading || !token,
    isError,
  }
}