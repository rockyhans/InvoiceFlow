import {
    FaChartLine,
    FaUsers,
    FaFileLines,
    FaFileInvoice,
    FaGear,
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
        { title: "Dashboard", path: "/dashboard", icon: <FaChartLine /> },
        { title: "Clients", path: "/clients", icon: <FaUsers /> },
        { title: "Quotes", path: "/quotes", icon: <FaFileLines /> },
        { title: "Invoices", path: "/invoices", icon: <FaFileInvoice /> },
        { title: "Settings", path: "/settings", icon: <FaGear /> },
    ];

    return (
        <div className="w-64 bg-white flex flex-col sticky top-0 h-screen self-start">
            <div className="bg-white p-2">
                <div className="flex items-center gap-3 p-2 border-b bg-gradient-to-r from-orange-600 to-indigo-600 text-white rounded-xl">
                    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-orange-600 font-bold shadow-sm">
                        ₹
                    </div>
                    <div className="leading-tight text-center">
                        <div className="text-sm font-bold tracking-wide">InvoiceFlow</div>
                    </div>
                </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
                {menu.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 p-3  mb-2 transition border-b ${isActive
                                ? "bg-orange-400 text-white"
                                : "hover:bg-gray-100"
                            }`
                        }
                    >
                        {item.icon}
                        {item.title}
                    </NavLink>
                ))}
            </div>

            <button
                onClick={handleLogout}
                className="flex items-center gap-3 p-4 border-t hover:bg-red-100 cursor-pointer"
            >
                <FaRightFromBracket />
                Logout
            </button>
        </div>
    );
};

export default Sidebar;