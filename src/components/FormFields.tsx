import { Stack, TextInput } from '@mantine/core'
import { Controller, useFormContext } from 'react-hook-form'

import { FormValues } from '../interfaces'

export const FormFields = () => {
  const { control } = useFormContext<FormValues>()

  return (
    <Stack mb="xl">
      <Controller
        name="searchTerm"
        control={control}
        render={({ field }) => (
          <TextInput
            label="Search"
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
