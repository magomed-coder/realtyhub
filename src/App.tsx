import { useEffect } from "react";
import { useAuthStore } from "./context/authStore";
import AppRoutes from "./components/Routes";

function App() {
  const fetchMe = useAuthStore((state) => state.fetchMe);

  useEffect(() => {
    fetchMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <AppRoutes />;
}

export default App;
