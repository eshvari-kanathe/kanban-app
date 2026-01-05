import React from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./route/ProtectedRoute";
import Form from "./pages/Form";
import { Toaster } from "sonner";

const App = () => {
  return (
    <div>
      <Toaster richColors position="top-right"/>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        ></Route>
                <Route
          path="/form"
          element={
            <ProtectedRoute>
              <Form />
            </ProtectedRoute>
          }
        ></Route>
        
      </Routes>
    </div>
  );
};

export default App;
