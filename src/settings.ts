import { SettingSchemaDesc } from '@logseq/libs/dist/LSPlugin.user'

export const settings: SettingSchemaDesc[] = [
  {
    key: 'maxResults',
    type: 'number',
    default: '100',
    title: 'Maximum Number of Results',
    description:
      'Set the maxinum number of results to return. Adjust accordingly if searching takes too long.',
  },
]
