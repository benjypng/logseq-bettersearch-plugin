import { BlockEntity } from '@logseq/libs/dist/LSPlugin'
import { Box, Button, Group, Paper, Stack, Text } from '@mantine/core'
import { Controller, useFormContext } from 'react-hook-form'

import { ResultCardProps } from '../interfaces'

export const ResultCard = ({ block, setResults }: ResultCardProps) => {
  const { control, watch } = useFormContext()
  const searchTerm = watch('searchTerm')

  const onReplace = async (block: any, replaceTerm: string) => {
    if (replaceTerm === '') {
      logseq.UI.showMsg('Enter a replace term', 'error')
      return
    }
    const newContent = block.title.replace(searchTerm, replaceTerm)
    await logseq.Editor.updateBlock(block.uuid, newContent)
    setResults((prev) => prev.filter((b) => b.uuid !== block.uuid))
  }

  const goToBlock = async (block: BlockEntity) => {
    const pageName = block?.page?.name
    if (pageName && block.uuid) {
      logseq.Editor.scrollToBlockInPage(pageName, block.uuid)
    } else {
      logseq.UI.showMsg('Unable to determine page for this block', 'warning')
    }
  }

  return (
    <Paper key={block.uuid} withBorder p="sm" shadow="xs">
      <Stack gap="xs">
        <Group justify="space-between" align="start">
          <Box style={{ flex: 1 }}>
            <Text size="xs" c="dimmed" ff="monospace">
              {block.uuid}
            </Text>
            <Text size="sm" lineClamp={3}>
              {block.title}
            </Text>
            <Text size="xs" c="dimmed" mt={4}>
              Page: [[{block?.page?.name}]]
            </Text>
          </Box>
        </Group>

        <Group grow>
          <Button size="xs" variant="default" onClick={() => goToBlock(block)}>
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
                onClick={() => onReplace(block, field.value)}
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
