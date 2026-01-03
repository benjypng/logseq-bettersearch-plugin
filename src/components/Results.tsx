import { Center, Loader, Stack, Text } from '@mantine/core'
import Fuse from 'fuse.js'
import { useEffect, useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import { FormValues, ResultsEntity } from '../interfaces'
import { getFirstWord } from '../utils'
import { ResultCard } from './ResultCard'

export const Results = () => {
  const [allBlocks, setAllBlocks] = useState<ResultsEntity[]>([])
  const [filteredResults, setFilteredResults] = useState<ResultsEntity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const { watch } = useFormContext<FormValues>()
  const searchTerm = watch('searchTerm')
  const sortBy = watch('sortBy')

  useEffect(() => {
    const fetchAllBlocks = async () => {
      setIsLoading(true)
      const query = `
        [:find (pull ?b [:block/uuid :block/title :block/created-at :block/updated-at {:block/page [:block/title]}])
        :where
        [?b :block/title ?content]
       ]`
      try {
        const res = await logseq.DB.datascriptQuery(query)
        setAllBlocks(res ? res.flat() : [])
      } catch (e: any) {
        console.error('Indexing failed:', e)
        logseq.UI.showMsg('Indexing failed', String(e.message))
      } finally {
        setIsLoading(false)
      }
    }
    fetchAllBlocks()
  }, [])

  const fuse = useMemo(() => {
    return new Fuse(allBlocks, {
      keys: ['title', 'page.title'],
      threshold: 0.4,
      ignoreLocation: true,
    })
  }, [allBlocks])

  useEffect(() => {
    if (!searchTerm || searchTerm.length < 3) {
      setFilteredResults([])
      return
    }
    const fuseResult = fuse.search(searchTerm)
    const results = fuseResult.map((r) => r.item)
    setFilteredResults(results)
  }, [searchTerm, fuse])

  const displayResults = useMemo(() => {
    if (!filteredResults.length) return []
    return [...filteredResults].sort((a, b) => {
      switch (sortBy) {
        case 'updated-at':
          return b['updated-at'] - a['updated-at']
        case 'created-at':
          return b['created-at'] - a['created-at']
        case 'page-title':
          return getFirstWord(a.page?.title || '').localeCompare(
            getFirstWord(b.page?.title || ''),
          )
        case 'block-content':
          return getFirstWord(a.title || '').localeCompare(
            getFirstWord(b.title || ''),
          )
        default:
          return 0
      }
    })
  }, [filteredResults, sortBy])

  const handleRemove = (uuid: string) => {
    setFilteredResults((prev) => prev.filter((b) => b.uuid !== uuid))
  }

  return (
    <Stack gap="xs">
      {isLoading && (
        <Center p="xl">
          <Loader size="sm" />
        </Center>
      )}

      {!isLoading && displayResults.length === 0 && searchTerm.length >= 3 && (
        <Text c="dimmed" size="sm">
          No matches found.
        </Text>
      )}

      {displayResults.slice(0, 50).map((result) => (
        <ResultCard
          key={result.uuid}
          result={result}
          setResults={() => handleRemove(result.uuid)}
        />
      ))}
    </Stack>
  )
}
