import { ToastProvider } from './contexts/toast-context';
import { router } from './routers';
import { RouterProvider } from 'react-router';
import { PayPalScriptProvider, type ReactPayPalScriptOptions } from '@paypal/react-paypal-js';

function App() {
  const paypalOptions: ReactPayPalScriptOptions = {
    clientId: "AaOadMzzJ6dvKzeobaiQ03btA_117amlqR_TyUZeXYUfXIWrF5ewtz015NMrSVKo4J9t7S74HQz62Oye",
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
