import { useCallback, useEffect, useState } from 'react'

import { ResultsEntity } from '../interfaces'

export const useAllBlocks = () => {
  const [allBlocks, setAllBlocks] = useState<ResultsEntity[]>([])

  const fetchBlocks = useCallback(async () => {
    const query = `
      [:find (pull ?b [:block/uuid :block/title :block/created-at :block/updated-at {:block/page [:block/title]}])
      :where
      [?b :block/title ?content]]
     ]`

    try {
      const res = await logseq.DB.datascriptQuery(query)
      if (res) setAllBlocks(res.flat())
    } catch (e) {
      console.error('BetterSearch: Indexing failed:', e)
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
