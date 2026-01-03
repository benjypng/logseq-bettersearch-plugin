import { Stack, TextInput } from '@mantine/core'
import { useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { FormValues, VisibilityProps } from '../interfaces'

export const FormFields = () => {
  const { control, setFocus } = useFormContext<FormValues>()

  useEffect(() => {
    const handleVisibility = ({ visible }: VisibilityProps) => {
      if (visible) {
        setTimeout(() => {
          window.focus()
          setFocus('searchTerm')
        }, 100)
      }
    }
    logseq.on('ui:visible:changed', handleVisibility)
    return () => {
      logseq.off('ui:visible:changed', handleVisibility)
    }
  }, [setFocus])

  return (
    <Stack mb="xl">
      <Controller
        name="searchTerm"
        control={control}
        render={({ field }) => (
          <TextInput
            autoFocus
            label="Search"
            description="Operators: ' (exact), ^ (start), ! (not) | Example: ^Apple"
            placeholder="Type to search..."
            {...field}
          />
        )}
      />
      <Controller
        name="replaceTerm"
        control={control}
        render={({ field }) => (
          <TextInput
            label="Replace with"
            placeholder="Replacement text..."
            {...field}
          />
        )}
      />
    </Stack>
  )
}
