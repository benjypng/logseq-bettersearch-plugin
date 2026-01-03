import { Dispatch, SetStateAction } from 'react'

export type SortByValues =
  | 'relevance'
  | 'updated-at'
  | 'created-at'
  | 'page-title'
  | 'block-content'

export interface FormValues {
  searchTerm: string
  replaceTerm: string
  sortBy: SortByValues
  filterOnlyCurrentPage: boolean
}

export interface ResultsEntity {
  content: string
  ['created-at']: number
  ['full-title']: string
  page: { title: string }
  title: string
  ['updated-at']: number
  uuid: string
}

export interface ResultCardProps {
  result: ResultsEntity
  setResults: Dispatch<SetStateAction<ResultsEntity[]>>
}

export interface VisibilityProps {
  visible: boolean
}

export interface SortButtonProps {
  disabled: boolean
}
