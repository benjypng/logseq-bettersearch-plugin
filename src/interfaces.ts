import { BlockEntity } from '@logseq/libs/dist/LSPlugin'
import { Dispatch, SetStateAction } from 'react'

export interface FormValues {
  searchTerm: string
  replaceTerm: string
}

export interface ResultCardProps {
  block: BlockEntity
  setResults: Dispatch<SetStateAction<BlockEntity[]>>
}
