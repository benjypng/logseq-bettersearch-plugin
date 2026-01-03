import { Button, Menu, rem } from '@mantine/core'
import {
  IconCalendar,
  IconClock,
  IconFileText,
  IconSortDescending,
} from '@tabler/icons-react'
import { Controller, useFormContext } from 'react-hook-form'

import { FormValues, SortButtonProps, SortByValues } from '../interfaces'

export const SortButton = ({ disabled }: SortButtonProps) => {
  const { control } = useFormContext<FormValues>()

  const getLabel = (value: SortByValues) => {
    switch (value) {
      case 'relevance':
        return 'Relevance'
      case 'created-at':
        return 'Created At'
      case 'page-title':
        return 'Page Title'
      case 'block-content':
        return 'Block Content'
      case 'updated-at':
        return 'Updated At'
    }
  }

  return (
    <Controller
      name="sortBy"
      control={control}
      defaultValue="relevance"
      render={({ field }) => (
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <Button
              disabled={disabled}
              variant="default"
              size="xs"
              leftSection={
                <IconSortDescending
                  style={{ width: rem(14), height: rem(14) }}
                />
              }
            >
              Sort: {getLabel(field.value)}
            </Button>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>Sort results by</Menu.Label>
            <Menu.Item
              leftSection={
                <IconClock style={{ width: rem(14), height: rem(14) }} />
              }
              onClick={() => field.onChange('relevance')}
            >
              Recommended
            </Menu.Item>
            <Menu.Item
              leftSection={
                <IconClock style={{ width: rem(14), height: rem(14) }} />
              }
              onClick={() => field.onChange('updated-at')}
            >
              Last Updated
            </Menu.Item>
            <Menu.Item
              leftSection={
                <IconCalendar style={{ width: rem(14), height: rem(14) }} />
              }
              onClick={() => field.onChange('created-at')}
            >
              Date Created
            </Menu.Item>
            <Menu.Item
              leftSection={
                <IconFileText style={{ width: rem(14), height: rem(14) }} />
              }
              onClick={() => field.onChange('page-title')}
            >
              Page Title
            </Menu.Item>
            <Menu.Item
              leftSection={
                <IconFileText style={{ width: rem(14), height: rem(14) }} />
              }
              onClick={() => field.onChange('block-content')}
            >
              Block Content
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      )}
    />
  )
}
