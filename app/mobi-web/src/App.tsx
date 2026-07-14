import { ToastProvider } from './contexts/toast-context';
import { router } from './routers';
import { RouterProvider } from 'react-router';

function App() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col sm:px-6 bg-white dark:bg-black">
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </main>
    </div>
  );
};

export default App;
