import '@mantine/core/styles.css'
import '@logseq/libs'

import { createRoot } from 'react-dom/client'

import { SearchReplaceContainer } from './components/SearchReplaceContainer'
import { settings } from './settings'

const main = async () => {
  logseq.UI.showMsg('logseq-searchreplace-plugin loaded')

  const el = document.getElementById('app')
  if (!el) return
  const root = createRoot(el)

  root.render(<SearchReplaceContainer />)

  logseq.App.registerCommandPalette(
    {
      key: 'logseq-searchreplace-plugin',
      label: 'Search and Replace',
      keybinding: {
        mode: 'global',
        binding: 'mod+shift+s',
      },
    },
    async () => {
      logseq.setMainUIInlineStyle({
        position: 'fixed',
        zIndex: 11,
        top: 0,
        left: 0,
        right: 'auto',
        width: '30rem',
      })
      logseq.toggleMainUI()
    },
  )
}

logseq.useSettingsSchema(settings).ready(main).catch(console.error)
