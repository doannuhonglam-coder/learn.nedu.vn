import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { enableMocking } from './mocks/init'
import { analytics } from '@shared/analytics'

async function bootstrap() {
  await enableMocking()
  analytics.init()

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

bootstrap()
