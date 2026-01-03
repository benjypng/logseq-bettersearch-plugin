import { Center, Loader, Stack, Text } from '@mantine/core'
import Fuse from 'fuse.js'
import { useEffect, useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import { useAllBlocks } from '../hooks'
import { FormValues, ResultsEntity } from '../interfaces'
import { getFirstWord } from '../utils'
import { ResultCard, SortButton } from '.'

export const Results = () => {
  const { allBlocks } = useAllBlocks()

  const [filteredResults, setFilteredResults] = useState<ResultsEntity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const { watch } = useFormContext<FormValues>()
  const searchTerm = watch('searchTerm')
  const sortBy = watch('sortBy')

  const fuse = useMemo(() => {
    return new Fuse(allBlocks, {
      keys: [
        { name: 'title', weight: 2 },
        {
          name: 'page.title',
          weight: 1,
        },
      ],
      threshold: 0.3,
      useExtendedSearch: true,
      ignoreLocation: true,
    })
  }, [allBlocks])

  useEffect(() => {
    setIsLoading(true)
    if (!searchTerm || searchTerm.length < 3) {
      setFilteredResults([])
      setIsLoading(false)
      return
    }
    const fuseResult = fuse.search(searchTerm)
    const results = fuseResult.map((r) => r.item)
    setFilteredResults(results)
    setIsLoading(false)
  }, [searchTerm, fuse])

  const displayResults = useMemo(() => {
    if (!filteredResults.length) return []

    return [...filteredResults].sort((a, b) => {
      switch (sortBy) {
        case 'updated-at':
          return (b['updated-at'] || 0) - (a['updated-at'] || 0)
        case 'created-at':
          return (b['created-at'] || 0) - (a['created-at'] || 0)
        case 'page-title':
          return getFirstWord(a.page?.title || '').localeCompare(
            getFirstWord(b.page?.title || ''),
          )
        case 'block-content':
          return getFirstWord(a.title || '').localeCompare(
            getFirstWord(b.title || ''),
          )
        default: // 'recommended'
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

      <SortButton disabled={displayResults.length === 0} />
      {displayResults.length > 0 && (
        <>
          {displayResults.slice(0, 50).map((result) => (
            <ResultCard
              key={result.uuid}
              result={result}
              setResults={() => handleRemove(result.uuid)}
            />
          ))}
        </>
      )}
    </Stack>
  )
}
