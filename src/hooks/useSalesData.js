import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"

export function useSalesData(filters, cursor) {
  const [token, setToken] = useState(null)

  useEffect(() => {
    const fetchToken = async () => {
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

  const { data, isLoading, isError, isFetching } = useQuery({
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
    enabled: !!token,
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  })

  return {
    sales: data?.results?.Sales || [],
    totalSales: data?.results?.TotalSales || [],
    apiPagination: data?.pagination || { before: "", after: "" },
    isLoading: isLoading && !data,
    isFetching,
    isError,
  }
}