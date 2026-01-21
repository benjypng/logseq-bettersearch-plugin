import { useCallback, useEffect, useState } from 'react'

import { ResultsEntity } from '../interfaces'

export const useAllBlocks = () => {
  const [allBlocks, setAllBlocks] = useState<ResultsEntity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchBlocks = useCallback(async () => {
    setIsLoading(true)
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
    } finally {
      setIsLoading(false)
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

    //Snippet to handle when Logseq first starts
    logseq.on('ui:visible:changed', fetchBlocks)

    return () => {
      logseq.off('ui:visible:changed', fetchBlocks)
      unsubscribe()
      clearTimeout(timeoutId)
    }
  }, [fetchBlocks])

  return { allBlocks, isLoading }
}
