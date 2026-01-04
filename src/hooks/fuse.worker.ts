import Fuse from 'fuse.js'

import { ResultsEntity } from '../interfaces'

let fuse: Fuse<ResultsEntity> | null = null

self.onmessage = (e: MessageEvent) => {
  const { type, payload } = e.data

  switch (type) {
    case 'INIT_INDEX': {
      fuse = new Fuse(payload, {
        keys: [
          { name: 'title', weight: 2 },
          { name: 'page.title', weight: 1 },
        ],
        threshold: 0.2,
        useExtendedSearch: true,
        ignoreLocation: true,
        ignoreFieldNorm: true,
      })
      postMessage({ type: 'INDEX_READY' })
      break
    }
    case 'SEARCH': {
      if (!fuse) return
      const { term, limit } = payload
      const results = fuse.search(term, { limit: limit || 50 })
      postMessage({
        type: 'SEARCH_RESULTS',
        payload: results.map((r) => r.item),
      })
      break
    }
  }
}
