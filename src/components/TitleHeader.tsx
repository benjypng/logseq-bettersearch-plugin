import { CloseButton, Group, Title } from '@mantine/core'

export const TitleHeader = () => {
  return (
    <Group justify="space-between" mb="lg">
      <Title order={3}>Search & Replace</Title>
      <CloseButton onClick={() => logseq.hideMainUI()} />
    </Group>
  )
}
