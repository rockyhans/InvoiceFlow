import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import DataTable from "../../components/table/DataTable";
import TablePagination from "../../components/table/TablePagination";
import Modal from "../../components/modal/Modal";
import ConfirmModal from "../../components/modal/ConfirmModal";
import ExpenseForm from "./ExpenseForm";

import {
    getExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
} from "../../api/expenseApi";

import { FaEdit, FaTrash, FaPlus, FaMoneyBillWave } from "react-icons/fa";

const Expenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [modalOpen, setModalOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState(null);

    const fetchExpenses = async () => {
        try {
            setLoading(true);
            const { data } = await getExpenses(page, search);

            // Handle direct data array (identical to Invoices.jsx and Clients.jsx)
            const list = Array.isArray(data?.data)
                ? data.data
                : Array.isArray(data?.data?.expenses)
                ? data.data.expenses
                : Array.isArray(data?.expenses)
                ? data.expenses
                : Array.isArray(data)
                ? data
                : [];

            setExpenses(list);
            setTotalPages(data?.pages || data?.totalPages || data?.data?.totalPages || 1);
        } catch (error) {
            console.error("Fetch expenses error:", error);
            setExpenses([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, [page, search]);

    const handleCreate = async (formData) => {
        try {
            setSubmitLoading(true);
            await createExpense(formData);
            setModalOpen(false);
            fetchExpenses();
        } catch (error) {
            console.error("Create expense error:", error);
            alert(error?.response?.data?.message || "Failed to record expense");
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleUpdate = async (formData) => {
        try {
            setSubmitLoading(true);
            await updateExpense(selectedExpense._id, formData);
            setSelectedExpense(null);
            setModalOpen(false);
            fetchExpenses();
        } catch (error) {
            console.error("Update expense error:", error);
            alert(error?.response?.data?.message || "Failed to update expense");
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            setDeleteLoading(true);
            await deleteExpense(selectedExpense._id);
            setDeleteOpen(false);
            setSelectedExpense(null);
            fetchExpenses();
        } catch (error) {
            console.error("Delete expense error:", error);
            alert(error?.response?.data?.message || "Failed to delete expense");
        } finally {
            setDeleteLoading(false);
        }
    };

    const columns = [
        {
            header: "Expense Title",
            accessor: "title",
            render: (row) => (
                <div>
                    <span className="font-semibold text-gray-800">{row.title}</span>
                    {row.notes && (
                        <p className="text-xs text-gray-500 truncate max-w-xs">{row.notes}</p>
                    )}
                </div>
            ),
        },
        {
            header: "Category",
            accessor: "category",
            render: (row) => (
                <span className="px-2.5 py-1 text-xs rounded-full bg-blue-50 text-blue-700 font-medium">
                    {row.category}
                </span>
            ),
        },
        {
            header: "Amount",
            accessor: "amount",
            render: (row) => (
                <span className="font-bold text-red-600">
                    ₹{Number(row.amount || 0).toLocaleString("en-IN")}
                </span>
            ),
        },
        {
            header: "Payment Method",
            accessor: "paymentMethod",
            render: (row) => (
                <span className="text-sm text-gray-600">{row.paymentMethod || "UPI"}</span>
            ),
        },
        {
            header: "Date",
            accessor: "date",
            render: (row) => (
                <span className="text-sm text-gray-600">
                    {row.date ? new Date(row.date).toLocaleDateString("en-IN") : "-"}
                </span>
            ),
        },
        {
            header: "Actions",
            accessor: "actions",
            render: (row) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            setSelectedExpense(row);
                            setModalOpen(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded cursor-pointer"
                        title="Edit"
                    >
                        <FaEdit />
                    </button>
                    <button
                        onClick={() => {
                            setSelectedExpense(row);
                            setDeleteOpen(true);
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded cursor-pointer"
                        title="Delete"
                    >
                        <FaTrash />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Expense Tracking</h1>
                        <p className="text-sm text-gray-500">Record and monitor your business expenses</p>
                    </div>
                    <Button
                        onClick={() => {
                            setSelectedExpense(null);
                            setModalOpen(true);
                        }}
                        className="flex items-center gap-2"
                    >
                        <FaPlus /> Add Expense
                    </Button>
                </div>

                <Card>
                    <div className="p-4 border-b">
                        <input
                            type="text"
                            placeholder="Search expenses by title or category..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full md:w-80 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>

                    {loading ? (
                        <div className="p-12 flex justify-center">
                            <Loader size="lg" />
                        </div>
                    ) : expenses.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <FaMoneyBillWave className="mx-auto text-4xl text-gray-300 mb-3" />
                            No expenses recorded yet. Click "Add Expense" to track one.
                        </div>
                    ) : (
                        <>
                            <DataTable columns={columns} data={expenses} />
                            <TablePagination
                                currentPage={page}
                                totalPages={totalPages}
                                onPageChange={setPage}
                            />
                        </>
                    )}
                </Card>

                {/* Add/Edit Modal */}
                <Modal
                    isOpen={modalOpen}
                    onClose={() => {
                        setModalOpen(false);
                        setSelectedExpense(null);
                    }}
                    title={selectedExpense ? "Edit Expense" : "Add Expense"}
                >
                    <ExpenseForm
                        initialData={selectedExpense}
                        onSubmit={selectedExpense ? handleUpdate : handleCreate}
                        loading={submitLoading}
                    />
                </Modal>

                {/* Confirm Delete Modal */}
                <ConfirmModal
                    isOpen={deleteOpen}
                    onClose={() => {
                        setDeleteOpen(false);
                        setSelectedExpense(null);
                    }}
                    onConfirm={handleDelete}
                    loading={deleteLoading}
                    title="Delete Expense"
                    message={`Are you sure you want to delete "${selectedExpense?.title}"? This cannot be undone.`}
                />
            </div>
        </DashboardLayout>
    );
};

export default Expenses;
