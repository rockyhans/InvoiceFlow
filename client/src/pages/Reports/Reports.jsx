import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import { getFinancialReport } from "../../api/reportApi";
import {
    FaArrowTrendUp,
    FaArrowTrendDown,
    FaScaleBalanced,
    FaFileInvoiceDollar,
    FaReceipt,
    FaPrint,
} from "react-icons/fa6";

const Reports = () => {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");

    const fetchReport = async () => {
        try {
            setLoading(true);
            setErrorMsg("");
            const res = await getFinancialReport();
            // Handle different response envelope shapes safely
            const data = res?.data?.data || res?.data || {};
            setReport(data);
        } catch (error) {
            console.error("Failed to load financial report:", error);
            setErrorMsg(error?.response?.data?.message || "Failed to load financial report");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, []);

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex justify-center items-center py-24">
                    <Loader size="lg" />
                </div>
            </DashboardLayout>
        );
    }

    const summary = report?.summary || {};
    const expensesByCategory = Array.isArray(report?.expensesByCategory) ? report.expensesByCategory : [];
    const budgetComparison = Array.isArray(report?.budgetComparison) ? report.budgetComparison : [];

    const totalRevenue = Number(summary.totalRevenue || 0);
    const paidRevenue = Number(summary.paidRevenue || 0);
    const pendingRevenue = Number(summary.pendingRevenue || 0);
    const totalExpenses = Number(summary.totalExpenses || 0);
    const netProfit = Number(summary.netProfit || 0);
    const profitMargin = summary.profitMargin ?? 0;
    const totalExpensesCount = summary.totalExpensesCount || 0;

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Financial Reporting</h1>
                        <p className="text-sm text-gray-500">
                            Overview of revenue, expenses, net profit, and budget variance
                        </p>
                    </div>
                    {/* <Button onClick={handlePrint} className="flex items-center gap-2">
                        <FaPrint /> Print / Export Report
                    </Button> */}
                </div>

                {errorMsg && (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                        {errorMsg}
                    </div>
                )}

                {/* Key Financial KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    <div className="bg-white rounded-xl shadow p-6 border-l-4 border-blue-600">
                        <div className="flex items-center justify-between">
                            <h3 className="text-gray-500 font-medium text-sm">Total Invoiced Revenue</h3>
                            {/* <FaFileInvoiceDollar className="text-blue-500 text-xl" /> */}
                        </div>
                        <h1 className="text-3xl mt-3 font-bold text-gray-800">
                            ₹{totalRevenue.toLocaleString("en-IN")}
                        </h1>
                        <div className="mt-2 text-xs text-gray-500 flex justify-between">
                            <span>Paid: ₹{paidRevenue.toLocaleString("en-IN")}</span>
                            <span>Pending: ₹{pendingRevenue.toLocaleString("en-IN")}</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow p-6 border-l-4 border-red-500">
                        <div className="flex items-center justify-between">
                            <h3 className="text-gray-500 font-medium text-sm">Total Expenses</h3>
                            {/* <FaReceipt className="text-red-500 text-xl" /> */}
                        </div>
                        <h1 className="text-3xl mt-3 font-bold text-red-600">
                            ₹{totalExpenses.toLocaleString("en-IN")}
                        </h1>
                        <p className="mt-2 text-xs text-gray-500">
                            Across {totalExpensesCount} recorded items
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow p-6 border-l-4 border-green-500">
                        <div className="flex items-center justify-between">
                            <h3 className="text-gray-500 font-medium text-sm">Net Profit</h3>
                            {netProfit >= 0 ? (
                                <FaArrowTrendUp className="text-green-500 text-xl" />
                            ) : (
                                <FaArrowTrendDown className="text-red-500 text-xl" />
                            )}
                        </div>
                        <h1
                            className={`text-3xl mt-3 font-bold ${netProfit >= 0 ? "text-green-600" : "text-red-600"
                                }`}
                        >
                            ₹{netProfit.toLocaleString("en-IN")}
                        </h1>
                        <p className="mt-2 text-xs text-gray-500">Revenue minus expenses</p>
                    </div>

                    <div className="bg-white rounded-xl shadow p-6 border-l-4 border-indigo-500">
                        <div className="flex items-center justify-between">
                            <h3 className="text-gray-500 font-medium text-sm">Profit Margin</h3>
                            {/* <FaScaleBalanced className="text-indigo-500 text-xl" /> */}
                        </div>
                        <h1 className="text-3xl mt-3 font-bold text-indigo-700">
                            {profitMargin}%
                        </h1>
                        <p className="mt-2 text-xs text-gray-500">Of total revenue</p>
                    </div>
                </div>

                {/* Detailed Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Expense by Category */}
                    <Card title="Expenses by Category">
                        <div className="p-4 space-y-4">
                            {expensesByCategory.length === 0 ? (
                                <p className="text-sm text-gray-400 py-6 text-center">
                                    No expense categorization data yet.
                                </p>
                            ) : (
                                expensesByCategory.map((item) => (
                                    <div key={item.category}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-semibold text-gray-700">{item.category}</span>
                                            <span className="text-gray-500">
                                                ₹{Number(item.total || 0).toLocaleString("en-IN")} ({item.percentage}%)
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                                            <div
                                                className="bg-orange-500 h-2.5 rounded-full"
                                                style={{ width: `${item.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>

                    {/* Budget Variance */}
                    <Card title="Budget vs Actual Variance">
                        <div className="p-4">
                            {budgetComparison.length === 0 ? (
                                <p className="text-sm text-gray-400 py-6 text-center">
                                    No budget set yet to compare against.
                                </p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead>
                                            <tr className="border-b text-gray-500 text-xs">
                                                <th className="pb-2">Category</th>
                                                <th className="pb-2">Allocated</th>
                                                <th className="pb-2">Spent</th>
                                                <th className="pb-2">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {budgetComparison.map((b) => (
                                                <tr key={b.category} className="hover:bg-gray-50">
                                                    <td className="py-2.5 font-medium text-gray-800">
                                                        {b.category}
                                                    </td>
                                                    <td className="py-2.5 text-gray-600">
                                                        ₹{Number(b.allocated || 0).toLocaleString("en-IN")}
                                                    </td>
                                                    <td className="py-2.5 text-gray-600">
                                                        ₹{Number(b.spent || 0).toLocaleString("en-IN")}
                                                    </td>
                                                    <td className="py-2.5">
                                                        <span
                                                            className={`px-2 py-0.5 rounded text-xs font-semibold ${b.status === "Over Budget"
                                                                ? "bg-red-100 text-red-700"
                                                                : "bg-green-100 text-green-700"
                                                                }`}
                                                        >
                                                            {b.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Reports;
