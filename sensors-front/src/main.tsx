import ReactDOM from 'react-dom/client'
import './index.css'
import { Dashboard } from './components/dashboard'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    }
  }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <Dashboard />
  </QueryClientProvider>,
)
