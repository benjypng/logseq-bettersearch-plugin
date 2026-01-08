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
  createdAt: number
  updatedAt: number
  fullTitle: string
  id: string
  pageTitle: string
  queryTerms: string[]
  terms: string[]
  score: number
  uuid: string
}

export interface ResultsProps {
  search: (term: string) => void
  isSearching: boolean
  workerResults: ResultsEntity[]
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
