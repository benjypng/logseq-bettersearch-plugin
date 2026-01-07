import { Badge, Box, Button, Group, Paper, Stack, Text } from '@mantine/core'
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

  const goToResult = async (result: ResultsEntity) => {
    const pageName = result.pageTitle
    if (pageName && result.uuid) {
      logseq.Editor.scrollToBlockInPage(pageName, result.uuid)
    } else {
      logseq.App.pushState('page', { name: result.pageTitle })
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
              <Badge size="xs" variant="dot" color="gray">
                {result.score.toFixed(2)}
              </Badge>
            </Group>

            <Text size="sm" lineClamp={3} fw={500}>
              {result.fullTitle}
            </Text>

            <Group gap={6} mt={6}>
              <Text size="xs" c="dimmed">
                {result.pageTitle || 'Page'}
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
          <Button
            size="xs"
            variant="default"
            onClick={() => goToResult(result)}
          >
            Go to Block
          </Button>
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
