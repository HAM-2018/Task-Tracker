import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {router} from "./routes.tsx";
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from './components/ui/sonner.tsx';

const queryClient = new QueryClient();


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
    <RouterProvider router={router}/>
    <Toaster />
    <ReactQueryDevtools initialIsOpen = {false}/>
    </QueryClientProvider>
  </StrictMode>,
);



