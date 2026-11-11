import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import DataTable from "../../components/table/DataTable";
import Modal from "../../components/modal/Modal";
import ConfirmModal from "../../components/modal/ConfirmModal";
import BudgetForm from "./BudgetForm";

import {
    getBudgets,
    createBudget,
    updateBudget,
    deleteBudget,
} from "../../api/budgetApi";

import { FaEdit, FaTrash, FaPlus, FaPiggyBank } from "react-icons/fa";

const Budgets = () => {
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const [modalOpen, setModalOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedBudget, setSelectedBudget] = useState(null);

    const fetchBudgets = async () => {
        try {
            setLoading(true);
            const { data } = await getBudgets();

            // Matches standard backend pattern ({ success, data: [...] })
            const list = Array.isArray(data?.data)
                ? data.data
                : Array.isArray(data)
                    ? data
                    : [];

            setBudgets(list);
        } catch (error) {
            console.error("Fetch budgets error:", error);
            setBudgets([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBudgets();
    }, []);

    const handleCreate = async (formData) => {
        try {
            setSubmitLoading(true);
            await createBudget(formData);
            setModalOpen(false);
            fetchBudgets();
        } catch (error) {
            console.error("Create budget error:", error);
            alert(error?.response?.data?.message || "Failed to create budget");
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleUpdate = async (formData) => {
        try {
            setSubmitLoading(true);
            await updateBudget(selectedBudget._id, formData);
            setSelectedBudget(null);
            setModalOpen(false);
            fetchBudgets();
        } catch (error) {
            console.error("Update budget error:", error);
            alert(error?.response?.data?.message || "Failed to update budget");
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            setDeleteLoading(true);
            await deleteBudget(selectedBudget._id);
            setDeleteOpen(false);
            setSelectedBudget(null);
            fetchBudgets();
        } catch (error) {
            console.error("Delete budget error:", error);
            alert(error?.response?.data?.message || "Failed to delete budget");
        } finally {
            setDeleteLoading(false);
        }
    };

    const columns = [
        {
            header: "Category",
            accessor: "category",
            render: (row) => (
                <div>
                    <span className="font-semibold text-gray-800">{row.category}</span>
                    <span className="ml-2 text-xs text-gray-400">({row.period})</span>
                </div>
            ),
        },
        {
            header: "Allocated Budget",
            accessor: "allocatedAmount",
            render: (row) => (
                <span className="font-bold text-gray-800">
                    ₹{Number(row.allocatedAmount || 0).toLocaleString("en-IN")}
                </span>
            ),
        },
        {
            header: "Actual Spent",
            accessor: "spent",
            render: (row) => (
                <span className={`font-semibold ${row.spent > row.allocatedAmount ? "text-red-600" : "text-gray-700"}`}>
                    ₹{Number(row.spent || 0).toLocaleString("en-IN")}
                </span>
            ),
        },
        {
            header: "Remaining",
            accessor: "remaining",
            render: (row) => (
                <span className={`font-semibold ${row.remaining <= 0 ? "text-red-600 font-bold" : "text-green-600"}`}>
                    ₹{Number(row.remaining || 0).toLocaleString("en-IN")}
                </span>
            ),
        },
        {
            header: "Progress",
            accessor: "progress",
            render: (row) => {
                const percent = row.percentageUsed || 0;
                const isOver = (row.spent || 0) > (row.allocatedAmount || 0);
                return (
                    <div className="w-36">
                        <div className="flex justify-between text-xs mb-1 font-medium">
                            <span className={isOver ? "text-red-600" : "text-gray-600"}>
                                {percent}%
                            </span>
                            {isOver && <span className="text-red-600 font-bold">Over!</span>}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className={`h-2 rounded-full ${isOver ? "bg-red-500" : percent > 80 ? "bg-yellow-500" : "bg-green-500"
                                    }`}
                                style={{ width: `${Math.min(100, percent)}%` }}
                            />
                        </div>
                    </div>
                );
            },
        },
        {
            header: "Actions",
            accessor: "actions",
            render: (row) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            setSelectedBudget(row);
                            setModalOpen(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded cursor-pointer"
                        title="Edit"
                    >
                        <FaEdit />
                    </button>
                    <button
                        onClick={() => {
                            setSelectedBudget(row);
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

    const safeBudgets = Array.isArray(budgets) ? budgets : [];
    const totalAllocated = safeBudgets.reduce((acc, curr) => acc + Number(curr.allocatedAmount || 0), 0);
    const totalSpent = safeBudgets.reduce((acc, curr) => acc + Number(curr.spent || 0), 0);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Budgeting</h1>
                        <p className="text-sm text-gray-500">Plan and track your spending limits by category</p>
                    </div>
                    <Button
                        onClick={() => {
                            setSelectedBudget(null);
                            setModalOpen(true);
                        }}
                        className="flex items-center gap-2"
                    >
                        <FaPlus /> Set New Budget
                    </Button>
                </div>

                {/* Summary Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl shadow p-5">
                        <h3 className="text-gray-500 font-medium text-sm">Total Budget Allocated</h3>
                        <h2 className="text-2xl font-bold text-blue-700 mt-2">
                            ₹{totalAllocated.toLocaleString("en-IN")}
                        </h2>
                    </div>
                    <div className="bg-white rounded-xl shadow p-5">
                        <h3 className="text-gray-500 font-medium text-sm">Total Category Spending</h3>
                        <h2 className={`text-2xl font-bold mt-2 ${totalSpent > totalAllocated ? "text-red-600" : "text-gray-800"}`}>
                            ₹{totalSpent.toLocaleString("en-IN")}
                        </h2>
                    </div>
                    <div className="bg-white rounded-xl shadow p-5">
                        <h3 className="text-gray-500 font-medium text-sm">Budget Remaining</h3>
                        <h2 className={`text-2xl font-bold mt-2 ${totalAllocated - totalSpent < 0 ? "text-red-600" : "text-green-600"}`}>
                            ₹{Math.max(0, totalAllocated - totalSpent).toLocaleString("en-IN")}
                        </h2>
                    </div>
                </div>

                <Card>
                    {loading ? (
                        <div className="p-12 flex justify-center">
                            <Loader size="lg" />
                        </div>
                    ) : safeBudgets.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <FaPiggyBank className="mx-auto text-4xl text-gray-300 mb-3" />
                            No budgets configured. Click "Set New Budget" to begin budgeting.
                        </div>
                    ) : (
                        <DataTable columns={columns} data={safeBudgets} />
                    )}
                </Card>

                {/* Add/Edit Modal */}
                <Modal
                    isOpen={modalOpen}
                    onClose={() => {
                        setModalOpen(false);
                        setSelectedBudget(null);
                    }}
                    title={selectedBudget ? "Edit Budget" : "Set New Budget"}
                >
                    <BudgetForm
                        initialData={selectedBudget}
                        onSubmit={selectedBudget ? handleUpdate : handleCreate}
                        loading={submitLoading}
                    />
                </Modal>

                {/* Confirm Delete Modal */}
                <ConfirmModal
                    isOpen={deleteOpen}
                    onClose={() => {
                        setDeleteOpen(false);
                        setSelectedBudget(null);
                    }}
                    onConfirm={handleDelete}
                    loading={deleteLoading}
                    title="Delete Budget"
                    message={`Are you sure you want to delete budget for "${selectedBudget?.category}"?`}
                />
            </div>
        </DashboardLayout>
    );
};

export default Budgets;
