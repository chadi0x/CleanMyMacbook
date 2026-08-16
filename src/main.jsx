import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import MenuBarPopover from './components/MenuBarPopover.jsx'

const isPopover = window.location.search.includes('popover=true') || window.location.hash.includes('popover');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isPopover ? <MenuBarPopover /> : <App />}
  </StrictMode>,
)
