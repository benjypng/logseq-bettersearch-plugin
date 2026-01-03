import { Flex, MantineProvider } from '@mantine/core'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { FormValues } from '../interfaces'
import { FormFields, Results, TitleHeader } from '.'

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

  return (
    <MantineProvider>
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
        <FormProvider {...formMethods}>
          <FormFields />
          <Results />
        </FormProvider>
      </Flex>
    </MantineProvider>
  )
}
