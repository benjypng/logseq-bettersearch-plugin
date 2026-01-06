import { useCallback, useEffect, useRef, useState } from 'react'

import { ResultsEntity } from '../interfaces'

export const useWorkerSearch = (allBlocks: ResultsEntity[]) => {
  const workerRef = useRef<Worker | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [results, setResults] = useState<ResultsEntity[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const startTime = performance.now()

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
        const endTime = performance.now()
        console.info('BetterSearch worker: Index built.')
        console.info(
          `%c%s %c[BetterSearch] Indexing took ${(endTime - startTime).toFixed(2)}ms`,
          'background:#000;color:#fff;padding:2px 6px;border-radius:4px;font-weight:600;',
          new Date().toISOString(),
          'background:#2b6cb0;color:#fff;padding:2px 6px;border-radius:4px;font-weight:600;',
        )
        logseq.UI.showMsg('logseq-bettersearch-plugin loaded', 'success')
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
