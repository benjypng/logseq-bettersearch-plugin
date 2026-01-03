import { Box, Button, Group, Paper, Stack, Text } from '@mantine/core'
import { Controller, useFormContext } from 'react-hook-form'

import { ResultCardProps, ResultsEntity } from '../interfaces'

export const ResultCard = ({ result, setResults }: ResultCardProps) => {
  const { control, watch } = useFormContext()
  const searchTerm = watch('searchTerm')

  const onReplace = async (result: ResultsEntity, replaceTerm: string) => {
    if (replaceTerm === '') {
      logseq.UI.showMsg('Enter a replace term', 'error')
      return
    }
    const newContent = result.title.replace(searchTerm, replaceTerm)
    await logseq.Editor.updateBlock(result.uuid, newContent)
    setResults((prev) => prev.filter((b) => b.uuid !== result.uuid))
  }

  const goToResult = async (result: ResultsEntity) => {
    const pageName = result?.page?.title
    if (pageName && result.uuid) {
      logseq.Editor.scrollToBlockInPage(pageName, result.uuid)
    } else {
      logseq.App.pushState('page', { name: result.title })
    }
  }

  return (
    <Paper withBorder p="sm" shadow="xs">
      <Stack gap="xs">
        <Group justify="space-between" align="start">
          <Box style={{ flex: 1 }}>
            <Text size="xs" c="dimmed" ff="monospace">
              {result.uuid}
            </Text>
            <Text size="sm" lineClamp={3}>
              {result['full-title']}
            </Text>
            <Text size="xs" c="dimmed" mt={4}>
              {result.page?.title
                ? `Page: ${result.page?.title}`
                : `This is a Page`}
            </Text>
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
