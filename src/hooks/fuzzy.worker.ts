import MiniSearch from 'minisearch'

let miniSearch: MiniSearch | null = null

self.onmessage = (e: MessageEvent) => {
  const { type, payload } = e.data

  switch (type) {
    case 'INIT_INDEX': {
      miniSearch = new MiniSearch({
        idField: 'uuid',
        fields: ['full-title', 'page.title'],
        storeFields: ['uuid', 'full-title', 'page'],
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
      const { term, limit = 50 } = payload

      const results = miniSearch.search(term)

      const items = results.slice(0, limit).map((r) => ({
        uuid: r.uuid,
        title: r.title,
        ['full-title']: r['full-title'],
        page: r.page,
      }))

      postMessage({
        type: 'SEARCH_RESULTS',
        payload: items,
      })
      break
    }
  }
}
