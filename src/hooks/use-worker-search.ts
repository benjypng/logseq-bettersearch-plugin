import { useCallback, useEffect, useRef, useState } from 'react'

import { ResultsEntity } from '../interfaces'

export const useWorkerSearch = (allBlocks: ResultsEntity[]) => {
  const workerRef = useRef<Worker | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [results, setResults] = useState<ResultsEntity[]>([])
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    workerRef.current = new Worker(
      new URL('./fuse.worker.ts', import.meta.url),
      {
        type: 'module',
      },
    )
    workerRef.current.onmessage = (e) => {
      const { type, payload } = e.data
      if (type === 'INDEX_READY') {
        setIsReady(true)
        console.info('BetterSearch worker: Index built.')
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
    console.info('BetterSearch worker: Sending data...')
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
