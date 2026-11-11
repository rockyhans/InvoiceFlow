import { useState, useEffect } from "react";
import FormInput from "../../components/forms/FormInput";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";

const CATEGORIES = [
    "Office Supplies",
    "Travel",
    "Utilities",
    "Rent",
    "Salaries",
    "Marketing",
    "Software & Subscriptions",
    "Maintenance",
    "Other",
];

const PAYMENT_METHODS = ["Cash", "Card", "Bank Transfer", "UPI", "Other"];

const ExpenseForm = ({ onSubmit, initialData = null, loading = false }) => {
    const [formData, setFormData] = useState({
        title: "",
        category: "Office Supplies",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        paymentMethod: "UPI",
        notes: "",
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || "",
                category: initialData.category || "Office Supplies",
                amount: initialData.amount ?? "",
                date: initialData.date ? new Date(initialData.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
                paymentMethod: initialData.paymentMethod || "UPI",
                notes: initialData.notes || "",
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = "Expense title is required";
        if (!formData.amount || Number(formData.amount) <= 0) newErrors.amount = "Enter a valid positive amount";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onSubmit({
            ...formData,
            amount: Number(formData.amount),
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
                label="Expense Title *"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Office Internet Bill"
                error={errors.title}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category *
                    </label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                        {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                <FormInput
                    label="Amount (₹) *"
                    name="amount"
                    type="number"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="e.g., 2500"
                    error={errors.amount}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                    label="Date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Method
                    </label>
                    <select
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                        {PAYMENT_METHODS.map((method) => (
                            <option key={method} value={method}>
                                {method}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes / Description
                </label>
                <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Additional details..."
                />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="submit" disabled={loading}>
                    {loading ? <Loader size="sm" /> : initialData ? "Update Expense" : "Add Expense"}
                </Button>
            </div>
        </form>
    );
};

export default ExpenseForm;

