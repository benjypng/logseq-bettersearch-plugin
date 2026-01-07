import { CloseButton, Group, Stack, Text, Title } from '@mantine/core'

export const TitleHeader = () => {
  return (
    <Group justify="space-between" align="flex-start" mb="xs">
      <Stack gap={2}>
        <Title order={4} fw={600} c="blue">
          Better Search
        </Title>
        <Text size="xs" c="dimmed">
          Powered by fuzzy
        </Text>
      </Stack>

      <CloseButton
        size="sm"
        variant="subtle"
        color="gray"
        onClick={() => logseq.hideMainUI()}
      />
    </Group>
  )
}
