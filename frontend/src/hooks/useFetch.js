import { useState, useEffect, useCallback, useRef } from 'react'

export default function useFetch(fetchFn, deps = []) {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const fnRef = useRef(fetchFn)
  fnRef.current = fetchFn

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fnRef.current()
      setData(res.data.data)
    } catch (e) {
      setError(e?.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => { fetch() }, [fetch])

  return { data, loading, error, refetch: fetch }
}
