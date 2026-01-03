import { Flex, Group, MantineProvider } from '@mantine/core'
import { CSSProperties, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { FormValues } from '../interfaces'
import { FormFields, Results, SortButton, TitleHeader } from '.'

export const SearchReplaceContainer = () => {
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light')

  const formMethods = useForm<FormValues>({
    defaultValues: { searchTerm: '', replaceTerm: '' },
  })

  useEffect(() => {
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

  const containerStyle: CSSProperties = {
    backgroundColor: themeMode === 'dark' ? '#1f2937' : '#e5e7eb',
    color: themeMode === 'dark' ? '#9ca3af' : '#4b5563',
    boxShadow: themeMode === 'dark' ? 'none' : '-2px 0 10px rgba(0,0,0,0.1)',
    borderLeft: `1px solid ${themeMode === 'dark' ? '#374151' : '#d1d5db'}`,
    minHeight: '100vh',
    height: 'auto',
    pointerEvents: 'auto',
    overflowY: 'auto',
  }

  return (
    <MantineProvider>
      <Flex
        p={'md'}
        pt={'2.5rem'}
        w={'100%'}
        h={'100vh'}
        direction={'column'}
        style={containerStyle}
      >
        <TitleHeader />
        <FormProvider {...formMethods}>
          <SortButton />
          <FormFields />
          <Results />
        </FormProvider>
      </Flex>
    </MantineProvider>
  )
}
