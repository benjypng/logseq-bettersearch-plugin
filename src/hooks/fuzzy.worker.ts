import MiniSearch from 'minisearch'

import { ResultsEntity } from '../interfaces'

let miniSearch: MiniSearch | null = null

self.onmessage = (e: MessageEvent) => {
  const { type, payload } = e.data

  switch (type) {
    case 'INIT_INDEX': {
      miniSearch = new MiniSearch({
        idField: 'uuid',
        fields: ['full-title', 'page'],
        storeFields: ['uuid', 'full-title', 'page', 'created-at', 'updated-at'],
        searchOptions: {
          boost: { title: 2 },
          fuzzy: 0.2,
          prefix: true,
        },
      })

      miniSearch.addAll(payload)

      postMessage({ type: 'INDEX_READY' })
      break
    }
    case 'SEARCH': {
      if (!miniSearch) return
      const { term, limit = logseq.settings?.maxResults ?? 50 } = payload

      const results = miniSearch.search(term)

      const mappedResults: ResultsEntity[] = results
        .slice(0, limit)
        .map((r) => ({
          createdAt: r['created-at'],
          updatedAt: r['updated-at'],
          fullTitle: r['full-title'],
          id: r.uuid,
          pageTitle: r.page?.title ?? null,
          queryTerms: r.queryTerms,
          score: r.score,
          uuid: r.uuid,
        }))

      postMessage({
        type: 'SEARCH_RESULTS',
        payload: mappedResults,
      })
      break
    }
  }
}
