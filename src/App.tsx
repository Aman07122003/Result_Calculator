import { Route, Routes } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import ProtectedRoute from "./components/ProtectedRoute";
import Registration from "./components/Registeration";
import Result from "./pages/result";


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
        <Route path="/search" element={<Registration />} />  {/* ✅ Search Page */}
        <Route path="/result/:rollNumber" element={<Result />} />  {/* ✅ Result Page */}
      </Routes>
    </AuthProvider>
  );
};

export default App;
