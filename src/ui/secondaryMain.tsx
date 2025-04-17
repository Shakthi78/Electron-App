import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import SecondaryApp from './SecondaryApp.tsx'

createRoot(document.getElementById('root1')!).render(
  <StrictMode>
      <SecondaryApp/>
  </StrictMode>,
)
