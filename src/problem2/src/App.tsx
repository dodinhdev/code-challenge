import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppHeader } from '@/components/AppHeader';
import { Problem1Page } from '@/pages/Problem1Page';
import { Problem2Page } from '@/pages/Problem2Page';
import { Problem3Page } from '@/pages/Problem3Page';
import { useTheme } from '@/hooks/useTheme';

export function App() {
  const { theme, toggle } = useTheme();

  return (
    <BrowserRouter>
      <div className="flex min-h-[100dvh] flex-col">
        <AppHeader theme={theme} onToggleTheme={toggle} />
        <Routes>
          <Route path="/" element={<Navigate to="/problem-2" replace />} />
          <Route path="/problem-1" element={<Problem1Page />} />
          <Route path="/problem-2" element={<Problem2Page />} />
          <Route path="/problem-3" element={<Problem3Page />} />
          <Route path="*" element={<Navigate to="/problem-2" replace />} />
        </Routes>
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{ duration: 4500 }}
          theme={theme}
        />
      </div>
    </BrowserRouter>
  );
}
