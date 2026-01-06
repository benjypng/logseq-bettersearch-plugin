import {
  Button,
  Center,
  Group,
  Loader,
  rem,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core'
import { IconFileText } from '@tabler/icons-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import { useAllBlocks, useWorkerSearch } from '../hooks'
import { FormValues, ResultsEntity } from '../interfaces'
import { getFirstWord } from '../utils'
import { ResultCard, SortButton } from '.'

export const Results = () => {
  const { allBlocks } = useAllBlocks()

  const {
    search,
    results: workerResults,
    isSearching,
  } = useWorkerSearch(allBlocks)

  const [localResults, setLocalResults] = useState<ResultsEntity[]>([])
  const [currentPageTitle, setCurrentPageTitle] = useState<string | null>(null)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

  const { watch } = useFormContext<FormValues>()
  const searchTerm = watch('searchTerm')
  const sortBy = watch('sortBy')

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)
    return () => clearTimeout(handler)
  }, [searchTerm])

  useEffect(() => {
    if (debouncedSearchTerm.length >= 3) {
      search(debouncedSearchTerm)
    } else {
      setLocalResults([])
    }
  }, [debouncedSearchTerm, search])

  useEffect(() => {
    setLocalResults(workerResults)
  }, [workerResults])

  const displayResults = useMemo(() => {
    if (!localResults.length) return []

    return [...localResults]
      .filter((result) => {
        if (currentPageTitle) {
          return result.page.title === currentPageTitle
        } else {
          return true
        }
      })
      .sort((a, b) => {
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
          default: // 'recommended' - preserves the Fuse.js relevance score order
            return 0
        }
      })
  }, [localResults, sortBy, currentPageTitle])

  const handleRemove = (uuid: string) => {
    setLocalResults((prev) => prev.filter((b) => b.uuid !== uuid))
  }

  const onlyCurrentPage = useCallback(async () => {
    const page = await logseq.Editor.getCurrentPage()
    if (!page || !page.title) {
      setCurrentPageTitle(null)
    } else {
      // Toggle off if already selected
      if (page.title === currentPageTitle) {
        setCurrentPageTitle(null)
      } else {
        setCurrentPageTitle(page.title)
      }
    }
  }, [currentPageTitle])

  return (
    <Stack gap="xs">
      <Group justify="space-between">
        <SortButton disabled={displayResults.length === 0} />
        <Tooltip label="Click again to reset" disabled={!currentPageTitle}>
          <Button
            disabled={localResults.length === 0}
            size="xs"
            variant={currentPageTitle ? 'light' : 'default'}
            color={currentPageTitle ? 'blue' : 'gray'}
            onClick={onlyCurrentPage}
          >
            <IconFileText style={{ width: rem(14), height: rem(14) }} />
          </Button>
        </Tooltip>
      </Group>

      {isSearching && (
        <Center p="xl">
          <Stack>
            <Loader size="sm" />
            <Text size="sm">
              Searching takes longer if you have long blocks (more than 500
              words per block)
            </Text>
          </Stack>
        </Center>
      )}

      {!isSearching && debouncedSearchTerm.length >= 3 && (
        <>
          {displayResults.length === 0 && (
            <Text c="dimmed" size="sm">
              No matches found.
            </Text>
          )}
          {displayResults.length > 0 && (
            <Text c="dimmed" size="sm">
              {displayResults.length} matches found.
            </Text>
          )}
        </>
      )}

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
