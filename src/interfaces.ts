import { Dispatch, SetStateAction } from 'react'

export interface FormValues {
  searchTerm: string
  replaceTerm: string
}

export interface ResultsEntity {
  content: string
  ['full-title ']: string
  page: { title: string }
  title: string
  uuid: string
}

export interface ResultCardProps {
  result: ResultsEntity
  setResults: Dispatch<SetStateAction<ResultsEntity[]>>
}

export interface VisibilityProps {
  visible: boolean
}
