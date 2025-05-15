import { React } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth } from "./hooks/AuthContext";
import getRoutes from "./routes";
import MainLayout from "./layouts/mainLayout";
function App() {
  const { isLoggedIn } = useAuth();
  const appRoutes = getRoutes(isLoggedIn);
  return (
    <Router>
      <div className="App relative">
        <Routes>
          {appRoutes.map((router, index) => {
            const Layout = router.layout !== null ? router.layout : MainLayout;
            const Page = router.component;
            return (
              <Route
                key={index}
                path={router.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
