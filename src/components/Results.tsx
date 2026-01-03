import { Stack, Text } from '@mantine/core'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import { FormValues, ResultsEntity } from '../interfaces'
import { getFirstWord } from '../utils'
import { ResultCard } from './ResultCard'

export const Results = () => {
  const [rawResults, setRawResults] = useState<ResultsEntity[]>([])

  const { watch } = useFormContext<FormValues>()
  const searchTerm = watch('searchTerm')
  const sortBy = watch('sortBy')

  const runQuery = useCallback(async (term: string) => {
    if (!term || term.length < 3) {
      setRawResults([])
      return
    }
    const query = `
        [:find (pull ?b [:block/uuid :block/title :block/created-at :block/updated-at {:block/page [:block/title]}])
        :where
        [?b :block/title ?content]
        [(clojure.string/includes? ?content "${term}")]]`
    try {
      const queryResults = await logseq.DB.datascriptQuery(query)
      setRawResults(queryResults ? queryResults.flat() : [])
    } catch (e) {
      console.error('Search failed:', e)
      setRawResults([])
    }
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      runQuery(searchTerm)
    }, 300)
    return () => clearTimeout(timeoutId)
  }, [searchTerm, runQuery])

  const sortedResults = useMemo(() => {
    if (!rawResults.length) return []

    return [...rawResults].sort((a, b) => {
      switch (sortBy) {
        case 'updated-at':
          return b['updated-at'] - a['updated-at']
        case 'created-at':
          return b['created-at'] - a['created-at']
        case 'page-title': {
          const titleA = getFirstWord(a.page.title)
          const titleB = getFirstWord(b.page.title)
          return titleA.localeCompare(titleB)
        }
        case 'block-content': {
          const blockA = getFirstWord(a.title)
          const blockB = getFirstWord(b.title)
          return blockA.localeCompare(blockB)
        }
        default:
          return 0
      }
    })
  }, [rawResults, sortBy])

  return (
    <Stack gap="xs">
      {sortedResults.length === 0 && searchTerm && searchTerm.length >= 3 && (
        <Text c="dimmed" size="sm">
          No matches found.
        </Text>
      )}
      {sortedResults.map((result) => (
        <ResultCard
          key={result.uuid}
          result={result}
          setResults={setRawResults}
        />
      ))}
    </Stack>
  )
}
