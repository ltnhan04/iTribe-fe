import { RouterProvider } from "react-router-dom";
import routes from "./routes/route";

export default function App() {
  return <RouterProvider router={routes} />;
}
