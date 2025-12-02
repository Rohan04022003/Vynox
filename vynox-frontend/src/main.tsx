import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { UserProvider } from './context/userContext.tsx'
import { TweetsProvider } from './context/TweetsContext.tsx'
import { VideosProvider } from './context/VideosContext.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <UserProvider>
      <VideosProvider>
        <TweetsProvider>
          <App />
        </TweetsProvider>
      </VideosProvider>
    </UserProvider>
  </BrowserRouter>,
)
