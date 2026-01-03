import { useCallback, useEffect, useState } from 'react'

import { ResultsEntity } from '../interfaces' // Adjust path as needed

export const useAllBlocks = () => {
  const [allBlocks, setAllBlocks] = useState<ResultsEntity[]>([])

  const fetchBlocks = useCallback(async () => {
    const startTime = performance.now()

    const query = `
      [:find (pull ?b [:block/uuid :block/title :block/created-at :block/updated-at {:block/page [:block/title]}])
      :where
      [?b :block/title ?content]]
     ]`

    try {
      const res = await logseq.DB.datascriptQuery(query)

      if (res) setAllBlocks(res.flat())
    } catch (e) {
      console.error('[BetterSearch] Indexing failed:', e)
    } finally {
      const endTime = performance.now()

      console.info(
        `%c%s %c[BetterSearch] Indexing took ${(endTime - startTime).toFixed(2)}ms`,
        'background:#000;color:#fff;padding:2px 6px;border-radius:4px;font-weight:600;',
        new Date().toISOString(),
        'background:#2b6cb0;color:#fff;padding:2px 6px;border-radius:4px;font-weight:600;',
      )
    }
  }, [])

  useEffect(() => {
    fetchBlocks()
    let timeoutId: ReturnType<typeof setTimeout>
    const unsubscribe = logseq.DB.onChanged(() => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        fetchBlocks()
      }, 5000)
    })

    return () => {
      unsubscribe()
      clearTimeout(timeoutId)
    }
  }, [fetchBlocks])

  return { allBlocks }
}
