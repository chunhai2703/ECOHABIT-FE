import { RouterProvider } from "react-router-dom";
import { router } from './routes';
import ToastWrapper from "./routes/toastwrapper";

function App() {

  return (
    <>
      <RouterProvider router={router} />
      <ToastWrapper />
    </>
  )
}

export default App
