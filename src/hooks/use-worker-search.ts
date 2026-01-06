import { useCallback, useEffect, useRef, useState } from 'react'

import { ResultsEntity } from '../interfaces'

export const useWorkerSearch = (allBlocks: ResultsEntity[]) => {
  const workerRef = useRef<Worker | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [results, setResults] = useState<ResultsEntity[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const startTimeRef = useRef<number>(0)

  useEffect(() => {
    workerRef.current = new Worker(
      new URL('./fuzzy.worker.ts', import.meta.url),
      {
        type: 'module',
      },
    )
    workerRef.current.onmessage = (e) => {
      const { type, payload } = e.data
      if (type === 'INDEX_READY') {
        setIsReady(true)
        console.info(
          `${new Date().toISOString()} BetterSearch worker: Index built in ${(performance.now() - startTimeRef.current) / 1000} seconds.`,
        )
      }
      if (type === 'SEARCH_RESULTS') {
        setResults(payload)
        setIsSearching(false)
      }
    }
    return () => {
      workerRef.current?.terminate()
    }
  }, [])

  useEffect(() => {
    if (!workerRef.current || allBlocks.length === 0) return
    setIsReady(false)
    startTimeRef.current = performance.now()
    console.info(
      `${new Date().toISOString()} BetterSearch worker: Sending data...`,
    )
    workerRef.current.postMessage({
      type: 'INIT_INDEX',
      payload: allBlocks,
    })
  }, [allBlocks])

  const search = useCallback(
    (term: string) => {
      if (!workerRef.current || !isReady) return
      setIsSearching(true)
      workerRef.current.postMessage({
        type: 'SEARCH',
        payload: { term, limit: 50 },
      })
    },
    [isReady],
  )
  return { search, results, isReady, isSearching }
}
