import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./App.css";

const queryClient = new QueryClient();

const PrivateRoute = ({ children }) => {
  const { token, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return token ? children : <Navigate to="/login" />;
};

const AppContent = () => {
  const { token } = useAuth();

  return (
    <div className={token ? "app-layout" : ""}>
      {token && <Sidebar />}
      <main className={token ? "main-container" : ""}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          {/* Add other routes as needed */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      
      {token && (
        <footer className="status-footer">
          <div className="status-pills">
            <span className="pill sonar">Quality: Checked</span>
            <span className="pill jenkins">Build: Automated</span>
            <span className="pill docker">AWS: Running</span>
          </div>
        </footer >
      )}
    </div>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

