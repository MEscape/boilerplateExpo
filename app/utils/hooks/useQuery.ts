import { useEffect, useState } from 'react'

export const useQuery = (fetchFunction: any) => {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetchFunction()
        setData(response.data)
      } catch (error: any) {
        setError(error?.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData().then()
  }, [fetchFunction])

  return { data, error, loading }
}
