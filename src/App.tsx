import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import ProtectedRoute from "./components/ProtectedRoute";
import Registration from "./components/Registeration";
import Result from "./pages/result";
import Compare from "./pages/Compare";

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route path="/search" element={<Registration />} />
        <Route path="/result/:year/:semester/:rollNumber" element={<Result />} />
        <Route 
        path="/compare/:year/:semester/:rollNumber1/:rollNumber2" 
        element={<Compare />} 
      />
      </Routes>
    </AuthProvider>
  );
};

export default App;