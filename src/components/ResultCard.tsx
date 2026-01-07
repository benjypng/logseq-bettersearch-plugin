import {
  Badge,
  Box,
  Button,
  Group,
  Paper,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core'
import { MouseEvent } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { ResultCardProps, ResultsEntity } from '../interfaces'

export const ResultCard = ({ result, setResults }: ResultCardProps) => {
  const { control, setError } = useFormContext()

  const onReplace = async (result: ResultsEntity, replaceTerm: string) => {
    if (replaceTerm === '') {
      setError('replaceTerm', {
        type: 'manual',
        message: 'Enter replacement text',
      })
      return
    }
    const newContent = result.fullTitle.replace(result.fullTitle, replaceTerm)
    await logseq.Editor.updateBlock(result.uuid, newContent)
    setResults((prev) => prev.filter((b) => b.uuid !== result.uuid))
  }

  const goToResult = async (result: ResultsEntity, e: MouseEvent) => {
    e.stopPropagation()

    if (e.metaKey || e.ctrlKey) {
      logseq.Editor.openInRightSidebar(result.uuid)
      return
    }

    const pageName = result.pageTitle
    if (pageName && result.uuid) {
      logseq.Editor.scrollToBlockInPage(pageName, result.uuid)
    } else {
      logseq.App.pushState('page', { name: result.fullTitle })
    }
  }

  return (
    <Paper withBorder p="sm" shadow="sm" radius="md">
      <Stack gap="sm">
        <Group justify="space-between" align="start" wrap="nowrap">
          <Box flex={1}>
            <Group gap="xs" mb={4}>
              <Text size="xs" c="dimmed" ff="monospace" lh={1}>
                {result.uuid}
              </Text>
              <Badge size="xs" color="gray" radius="sm">
                {result.pageTitle || 'Page'}
              </Badge>
            </Group>

            <Text size="sm" lineClamp={3} fw={500}>
              {result.fullTitle}
            </Text>

            <Group gap={6} mt={6}>
              <Text size="xs" c="dimmed">
                {result.score.toFixed(2)}
              </Text>
              <Text size="xs" c="dimmed">
                •
              </Text>
              <Text size="xs" c="dimmed" lineClamp={1}>
                Match: {result.queryTerms.join(', ')}
              </Text>
            </Group>
          </Box>
        </Group>

        <Group grow>
          <Tooltip label="Ctrl/Cmd+click to open in sidebar">
            <Button
              size="xs"
              variant="default"
              onClick={(e: MouseEvent) => goToResult(result, e)}
            >
              Go to Block
            </Button>
          </Tooltip>
          <Controller
            name="replaceTerm"
            control={control}
            render={({ field }) => (
              <Button
                size="xs"
                variant="light"
                color="blue"
                onClick={() => onReplace(result, field.value)}
              >
                Replace
              </Button>
            )}
          />
        </Group>
      </Stack>
    </Paper>
  )
}
