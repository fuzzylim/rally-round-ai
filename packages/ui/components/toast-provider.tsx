'use client';

import { ToastProvider as RadixToastProvider } from '@radix-ui/react-toast';
import { ToastViewport } from './toast';

export function Toaster({ children }: { children: React.ReactNode }) {
  return (
    <RadixToastProvider>
      {children}
      <ToastViewport />
    </RadixToastProvider>
  );
}
