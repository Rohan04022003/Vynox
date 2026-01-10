import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { UserProvider } from './context/userContext.tsx'
import { TweetsProvider } from './context/TweetsContext.tsx'
import { VideosProvider } from './context/VideosContext.tsx'
import { SubscriptionProvider } from './context/SubscriptionContext.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <UserProvider>
      <SubscriptionProvider>
        <VideosProvider>
          <TweetsProvider>
            <App />
          </TweetsProvider>
        </VideosProvider>
      </SubscriptionProvider>
    </UserProvider>
  </BrowserRouter>,
)
