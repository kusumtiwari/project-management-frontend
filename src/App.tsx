import { BrowserRouter } from 'react-router-dom';
import MainRoute from './routes/MainRoute';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner'; // ✅ import Toaster
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <MainRoute />
        <Toaster richColors /> {/* ✅ Add this anywhere inside */}
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
