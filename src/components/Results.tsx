import { Stack, Text } from '@mantine/core'
import { useCallback, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import { FormValues, ResultsEntity } from '../interfaces'
import { ResultCard } from './ResultCard'

export const Results = () => {
  const [results, setResults] = useState<ResultsEntity[]>([])
  const { watch } = useFormContext<FormValues>()
  const searchTerm = watch('searchTerm')

  const runQuery = useCallback(async (term: string) => {
    //TODO: Implement better debounce if there is feedback about glitches
    if (!term || term.length < 3) {
      setResults([])
      return
    }
    const query = `
        [:find (pull ?b [:block/uuid :block/title :block/created-at :block/updated-at {:block/page [:block/title]}])
        :where
        [?b :block/title ?content]
        [(clojure.string/includes? ?content "${term}")]]`

    try {
      const queryResults = await logseq.DB.datascriptQuery(query)
      if (!queryResults) setResults([])
      setResults(queryResults.flat())
    } catch (e) {
      console.error('Search failed:', e)
    }
  }, [])

  // Refresh results when a replacement happens
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      runQuery(searchTerm)
    }, 300)
    return () => clearTimeout(timeoutId)
  }, [searchTerm, runQuery])

  return (
    <Stack gap="xs">
      {results.length === 0 && searchTerm && (
        <Text c="dimmed" size="sm">
          No matches found.
        </Text>
      )}

      {results.map((result) => (
        <ResultCard key={result.uuid} result={result} setResults={setResults} />
      ))}
    </Stack>
  )
}
