import { ToastProvider } from './contexts/toast-context';
import { router } from './routers';
import { RouterProvider } from 'react-router';
import { PayPalScriptProvider, type ReactPayPalScriptOptions } from '@paypal/react-paypal-js';

function App() {
  const paypalOptions: ReactPayPalScriptOptions = {
    clientId: "Afe584rs6RidqkgoOAGmkVKbEXmTuwY2STPF-oV6pxdm7W2LVLUuPPHqPINDykK6axeoeELM9LvRFiNm",
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col sm:px-6 bg-white dark:bg-black">
        <ToastProvider>
          <PayPalScriptProvider options={paypalOptions}>
            <RouterProvider router={router} />
          </PayPalScriptProvider>
        </ToastProvider>
      </main>
    </div>
  );
}

export default App
