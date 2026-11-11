import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";

import { getInvoices } from "../api/invoiceApi";
import { getExpenses } from "../api/expenseApi";
import { getBudgets } from "../api/budgetApi";
import { getFinancialReport } from "../api/reportApi";
import {
    FaFileInvoiceDollar,
    FaMoneyBillWave,
    FaPiggyBank,
    FaChartPie,
    FaArrowRight,
} from "react-icons/fa6";

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalExpenses: 0,
        netProfit: 0,
        invoicesCount: 0,
        expensesCount: 0,
        budgetsCount: 0,
    });

    const [recentExpenses, setRecentExpenses] = useState([]);
    const [recentInvoices, setRecentInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            setLoading(true);

            const [reportRes, expensesRes, invoicesRes, budgetsRes] = await Promise.allSettled([
                getFinancialReport(),
                getExpenses(1, ""),
                getInvoices(1, ""),
                getBudgets(),
            ]);

            const reportData = reportRes.status === "fulfilled" ? reportRes.value?.data?.data?.summary : null;
            const expensesData = expensesRes.status === "fulfilled" ? expensesRes.value?.data : null;
            const invoicesData = invoicesRes.status === "fulfilled" ? invoicesRes.value?.data : null;
            const budgetsData = budgetsRes.status === "fulfilled" ? budgetsRes.value?.data?.data : [];

            const totalRevenue = reportData?.totalRevenue ?? 0;
            const totalExpenses = reportData?.totalExpenses ?? 0;
            const netProfit = reportData?.netProfit ?? 0;

            const invoiceList = invoicesData?.invoices || invoicesData?.data || [];
            const expenseList = expensesData?.expenses || expensesData?.data || [];

            setStats({
                totalRevenue,
                totalExpenses,
                netProfit,
                invoicesCount: invoiceList.length,
                expensesCount: expensesData?.totalExpenses || expenseList.length,
                budgetsCount: budgetsData?.length || 0,
            });

            setRecentExpenses(expenseList.slice(0, 5));
            setRecentInvoices(invoiceList.slice(0, 5));
        } catch (error) {
            console.error("Dashboard Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Financial Dashboard</h1>
                    <p className="text-sm text-gray-500">
                        Summary of invoicing, expense tracking, and active budgets
                    </p>
                </div>

                {/* 4 Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    <div className="bg-white rounded-xl shadow p-6 border-l-4 border-blue-500">
                        <div className="flex items-center justify-between text-gray-500">
                            <span className="font-medium text-sm">Total Invoiced</span>
                        </div>
                        <h1 className="text-3xl mt-3 font-bold text-gray-800">
                            {loading ? "..." : `₹${stats.totalRevenue.toLocaleString("en-IN")}`}
                        </h1>
                        <p className="text-xs text-gray-400 mt-2">{stats.invoicesCount} Invoices</p>
                    </div>

                    <div className="bg-white rounded-xl shadow p-6 border-l-4 border-red-500">
                        <div className="flex items-center justify-between text-gray-500">
                            <span className="font-medium text-sm">Total Expenses</span>
                            {/* <FaMoneyBillWave className="text-red-500 text-lg" /> */}
                        </div>
                        <h1 className="text-3xl mt-3 font-bold text-red-600">
                            {loading ? "..." : `₹${stats.totalExpenses.toLocaleString("en-IN")}`}
                        </h1>
                        <p className="text-xs text-gray-400 mt-2">{stats.expensesCount} Expenses Tracked</p>
                    </div>

                    <div className="bg-white rounded-xl shadow p-6 border-l-4 border-green-500">
                        <div className="flex items-center justify-between text-gray-500">
                            <span className="font-medium text-sm">Net Profit</span>
                            {/* <FaChartPie className="text-green-500 text-lg" /> */}
                        </div>
                        <h1
                            className={`text-3xl mt-3 font-bold ${stats.netProfit >= 0 ? "text-green-600" : "text-red-600"
                                }`}
                        >
                            {loading ? "..." : `₹${stats.netProfit.toLocaleString("en-IN")}`}
                        </h1>
                        <p className="text-xs text-gray-400 mt-2">Revenue minus Expenses</p>
                    </div>

                    <div className="bg-white rounded-xl shadow p-6 border-l-4 border-orange-500">
                        <div className="flex items-center justify-between text-gray-500">
                            <span className="font-medium text-sm">Active Budgets</span>
                            {/* <FaPiggyBank className="text-orange-500 text-lg" /> */}
                        </div>
                        <h1 className="text-3xl mt-3 font-bold text-orange-600">
                            {loading ? "..." : stats.budgetsCount}
                        </h1>
                        <p className="text-xs text-gray-400 mt-2">Budgeted Categories</p>
                    </div>
                </div>

                {/* Quick Navigation Panels */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link
                        to="/expenses"
                        className="bg-white p-5 rounded-xl shadow hover:shadow-md transition flex items-center justify-between group"
                    >
                        <div>
                            <h3 className="font-semibold text-gray-800">Track an Expense</h3>
                            <p className="text-xs text-gray-500 mt-1">Add receipts and track team spending</p>
                        </div>
                        <FaArrowRight className="text-orange-500 group-hover:translate-x-1 transition" />
                    </Link>

                    <Link
                        to="/invoices"
                        className="bg-white p-5 rounded-xl shadow hover:shadow-md transition flex items-center justify-between group"
                    >
                        <div>
                            <h3 className="font-semibold text-gray-800">Manage Invoices</h3>
                            <p className="text-xs text-gray-500 mt-1">Create, download, and send invoices</p>
                        </div>
                        <FaArrowRight className="text-blue-500 group-hover:translate-x-1 transition" />
                    </Link>

                    <Link
                        to="/reports"
                        className="bg-white p-5 rounded-xl shadow hover:shadow-md transition flex items-center justify-between group"
                    >
                        <div>
                            <h3 className="font-semibold text-gray-800">Financial Reports</h3>
                            <p className="text-xs text-gray-500 mt-1">Detailed P&L & budget variance</p>
                        </div>
                        <FaArrowRight className="text-indigo-500 group-hover:translate-x-1 transition" />
                    </Link>
                </div>

                {/* Recent Activity: Expenses & Invoices side-by-side */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Invoices */}
                    <div className="bg-white rounded-xl shadow p-5">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-800">Recent Invoices</h3>
                            <Link to="/invoices" className="text-xs text-orange-600 font-semibold hover:underline">
                                View all
                            </Link>
                        </div>
                        {recentInvoices.length === 0 ? (
                            <p className="text-sm text-gray-400 py-6 text-center">No invoices yet</p>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {recentInvoices.map((inv) => (
                                    <div key={inv._id} className="py-2.5 flex justify-between items-center text-sm">
                                        <div>
                                            <p className="font-semibold text-gray-800">{inv.invoiceNumber}</p>
                                            <p className="text-xs text-gray-400">
                                                {inv.client?.name || "Client"}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-800">
                                                ₹{Number(inv.total || inv.grandTotal || 0).toLocaleString("en-IN")}
                                            </p>
                                            <span
                                                className={`text-[10px] px-2 py-0.5 rounded font-semibold ${inv.status === "Paid"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                                    }`}
                                            >
                                                {inv.status || "Pending"}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Recent Expenses */}
                    <div className="bg-white rounded-xl shadow p-5">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-800">Recent Expenses</h3>
                            <Link to="/expenses" className="text-xs text-orange-600 font-semibold hover:underline">
                                View all
                            </Link>
                        </div>
                        {recentExpenses.length === 0 ? (
                            <p className="text-sm text-gray-400 py-6 text-center">No expenses recorded yet</p>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {recentExpenses.map((exp) => (
                                    <div key={exp._id} className="py-2.5 flex justify-between items-center text-sm">
                                        <div>
                                            <p className="font-semibold text-gray-800">{exp.title}</p>
                                            <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
                                                {exp.category}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-red-600">
                                                -₹{Number(exp.amount || 0).toLocaleString("en-IN")}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {exp.date ? new Date(exp.date).toLocaleDateString("en-IN") : ""}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;
