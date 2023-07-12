// import logo from "./logo.svg";
import "./App.css";
import Form from "./modules/Form";
import Dashboard from "./modules/Dashboard";
import { Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//protectedRoute function
const ProtectedRoute = ({ children, auth = false }) => {
  const isLoggedIn = localStorage.getItem("user:token") !== null || false;
  if (!isLoggedIn && auth) {
    return <Navigate to={"/login"} />;
  } else if (
    isLoggedIn &&
    ["/login", "/signUp"].includes(window.location.pathname)
  ) {

    return <Navigate to={"/"} />;
  }


  return children;
};


function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute auth={true}>
            <Dashboard
              isLoggedIn={localStorage.getItem("user:token") !== null}
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/login"
        element={
          <ProtectedRoute>
            <Form isSignInPage={true} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/signUp"
        element={
          <ProtectedRoute>
            <Form isSignInPage={false} />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
