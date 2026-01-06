import { Flex, MantineProvider } from '@mantine/core'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { useAllBlocks, useWorkerSearch } from '../hooks'
import { FormValues } from '../interfaces'
import { FormFields, Results, TitleHeader } from '.'

export const SearchReplaceContainer = () => {
  const { allBlocks } = useAllBlocks()
  const {
    search,
    results: workerResults,
    isSearching,
  } = useWorkerSearch(allBlocks)

  const formMethods = useForm<FormValues>({
    defaultValues: { searchTerm: '', replaceTerm: '' },
  })

  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    // Handle theme change
    logseq.App.getUserConfigs().then((config) => {
      setThemeMode(config.preferredThemeMode as 'light' | 'dark')
    })
    const cleanup = logseq.App.onThemeModeChanged(({ mode }) => {
      setThemeMode(mode)
    })
    return () => {
      cleanup()
    }
  }, [])

  useEffect(() => {
    // Handle shortcut to toggle UI
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        logseq.toggleMainUI()
        return
      }
      if (
        (e.metaKey || e.ctrlKey) &&
        e.shiftKey &&
        e.key.toLowerCase() === 's'
      ) {
        e.preventDefault()
        logseq.toggleMainUI()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <MantineProvider>
      <FormProvider {...formMethods}>
        <Flex
          p="md"
          pt="2.5rem"
          w="100%"
          h="100vh"
          mih="100vh"
          direction="column"
          bg={themeMode === 'dark' ? '#1f2937' : '#e5e7eb'}
          c={themeMode === 'dark' ? '#9ca3af' : '#4b5563'}
          bdrs={'5px solid red'}
          style={{
            boxShadow:
              themeMode === 'dark' ? 'none' : '4px 0 8px -2px rgba(0,0,0,0.1)',
            overflowY: 'auto',
          }}
        >
          <TitleHeader />
          <FormFields />
          <Results
            search={search}
            isSearching={isSearching}
            workerResults={workerResults}
          />
        </Flex>
      </FormProvider>
    </MantineProvider>
  )
}
