import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
// import Clients from "./pages/Clients";
// import Quotes from "./pages/Quotes";
// import Invoices from "./pages/Invoices";
// import Settings from "./pages/Settings";
import ProtectedRoute from "./routes/ProtectedRoute";
import Clients from "./pages/Clients/Clients";
import Quotes from "./pages/Quotes/Quotes";
import Invoices from "./pages/Invoices/Invoices";
import Settings from "./pages/Settings/Settings";
import InvoiceDetail from "./pages/Invoices/InvoiceDetail";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route path="/" element={<Login />} />
                <Route path="/invoices/:id" element={<InvoiceDetail />} />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/clients"
                    element={
                        <ProtectedRoute>
                            <Clients />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/quotes"
                    element={
                        <ProtectedRoute>
                            <Quotes />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/invoices"
                    element={
                        <ProtectedRoute>
                            <Invoices />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/settings"
                    element={
                        <ProtectedRoute>
                            <Settings />
                        </ProtectedRoute>
                    }
                />

            </Routes>

        </BrowserRouter>

    );

}

export default App;