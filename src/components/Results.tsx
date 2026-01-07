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

import { FormValues, ResultsEntity, ResultsProps } from '../interfaces'
import { getFirstWord } from '../utils'
import { ResultCard, SortButton } from '.'

export const Results = ({
  search,
  isSearching,
  workerResults,
}: ResultsProps) => {
  const [currentPageTitle, setCurrentPageTitle] = useState<string | null>(null)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [localResults, setLocalResults] = useState<ResultsEntity[]>([])

  const { watch } = useFormContext<FormValues>()
  const searchTerm = watch('searchTerm')
  const sortBy = watch('sortBy')

  useEffect(() => {
    if (debouncedSearchTerm.length >= 3) {
      search(debouncedSearchTerm)
    } else {
      setLocalResults([])
    }

    const onVisibleChanged = ({ visible }: { visible: boolean }) => {
      if (visible && debouncedSearchTerm.length >= 3) {
        search(debouncedSearchTerm)
      }
    }
    logseq.on('ui:visible:changed', onVisibleChanged)
    return () => {
      logseq.off('ui:visible:changed', onVisibleChanged)
    }
  }, [debouncedSearchTerm, search])

  useEffect(() => {
    setLocalResults(workerResults)
  }, [workerResults])

  useEffect(() => {
    // Debounce search term
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)
    return () => clearTimeout(handler)
  }, [searchTerm])

  const displayResults = useMemo(() => {
    if (!localResults.length) return []

    return [...localResults]
      .filter((result) => {
        if (currentPageTitle) {
          return result.pageTitle === currentPageTitle
        } else {
          return result
        }
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'updated-at':
            return (b.updatedAt || 0) - (a.updatedAt || 0)
          case 'created-at':
            return (b.createdAt || 0) - (a.createdAt || 0)
          case 'page-title':
            return getFirstWord(a.pageTitle || '').localeCompare(
              getFirstWord(b.pageTitle || ''),
            )
          case 'block-content':
            return getFirstWord(a.fullTitle || '').localeCompare(
              getFirstWord(b.fullTitle || ''),
            )
          default:
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

  const createPage = async () => {
    await logseq.Editor.createPage(
      searchTerm,
      {},
      {
        redirect: true,
      },
    )
  }

  return (
    <Stack gap="xs">
      <Group justify="space-between">
        <SortButton disabled={displayResults.length === 0} />
        <Tooltip label="Click again to reset" disabled={!currentPageTitle}>
          <Button
            disabled={localResults.length === 0}
            size="xs"
            variant={currentPageTitle ? 'light' : 'default'}
            color="blue"
            onClick={onlyCurrentPage}
          >
            <IconFileText style={{ width: rem(14), height: rem(14) }} />
          </Button>
        </Tooltip>
      </Group>

      {isSearching && (
        <Center p="xl">
          <Stack align="center" gap={4}>
            <Loader size="sm" type="dots" />
            <Text size="xs" c="dimmed" ta="center">
              Searching large blocks...
            </Text>
          </Stack>
        </Center>
      )}

      {!isSearching && debouncedSearchTerm.length >= 3 && (
        <>
          {displayResults.length === 0 && (
            <Stack align="center" py="lg">
              <Text c="dimmed" size="sm">
                No matches found.
              </Text>
              <Button size="xs" variant="light" onClick={createPage}>
                Create Page
              </Button>
            </Stack>
          )}
          {displayResults.length > 0 && (
            <Text c="dimmed" size="xs" fw={700} tt="uppercase">
              {displayResults.length} matches found
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
