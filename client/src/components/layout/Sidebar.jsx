import {
    FaChartLine,
    FaUsers,
    FaFileInvoice,
    FaMoneyBillWave,
    FaPiggyBank,
    FaChartPie,
    FaRightFromBracket,
} from "react-icons/fa6";

import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Sidebar = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const menu = [
        { title: "Dashboard", path: "/dashboard" },
        { title: "Clients", path: "/clients" },
        { title: "Invoices", path: "/invoices" },
        { title: "Expenses", path: "/expenses" },
        { title: "Budgeting", path: "/budgets" },
        { title: "Financial Reports", path: "/reports" },
    ];

    return (
        <div className="w-64 bg-white flex flex-col sticky top-0 h-screen self-start">
            <div className="bg-white p-2">
                <div className="flex items-center gap-3 p-2 border-b bg-gradient-to-r from-orange-600 to-indigo-600 text-white rounded-xl">
                    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-orange-600 font-bold shadow-sm">
                        ₹
                    </div>
                    <div className="leading-tight text-center">
                        <div className="text-sm font-bold tracking-wide">FinanceFlow</div>
                    </div>
                </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
                {menu.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 p-3 mb-2 rounded-lg transition ${isActive
                                ? "bg-orange-500 text-white shadow-sm"
                                : "hover:bg-gray-100 text-gray-700"
                            }`
                        }
                    >
                        {item.icon}
                        <span className="font-medium text-sm">{item.title}</span>
                    </NavLink>
                ))}
            </div>

            <button
                onClick={handleLogout}
                className="flex items-center gap-3 p-4 border-t hover:bg-red-50 text-gray-700 hover:text-red-600 cursor-pointer transition"
            >
                <FaRightFromBracket />
                <span className="font-medium text-sm">Logout</span>
            </button>
        </div>
    );
};

export default Sidebar;
