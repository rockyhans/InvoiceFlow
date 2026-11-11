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

const PERIODS = ["Monthly", "Quarterly", "Yearly"];

const BudgetForm = ({ onSubmit, initialData = null, loading = false }) => {
    const [formData, setFormData] = useState({
        category: "Office Supplies",
        allocatedAmount: "",
        period: "Monthly",
        notes: "",
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                category: initialData.category || "Office Supplies",
                allocatedAmount: initialData.allocatedAmount ?? "",
                period: initialData.period || "Monthly",
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
        if (!formData.allocatedAmount || Number(formData.allocatedAmount) <= 0) {
            newErrors.allocatedAmount = "Enter a valid positive allocated budget amount";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onSubmit({
            ...formData,
            allocatedAmount: Number(formData.allocatedAmount),
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                </label>
                <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    disabled={!!initialData}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
                >
                    {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                    label="Allocated Budget (₹) *"
                    name="allocatedAmount"
                    type="number"
                    value={formData.allocatedAmount}
                    onChange={handleChange}
                    placeholder="e.g., 50000"
                    error={errors.allocatedAmount}
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Budget Period
                    </label>
                    <select
                        name="period"
                        value={formData.period}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                        {PERIODS.map((p) => (
                            <option key={p} value={p}>
                                {p}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                </label>
                <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Target or limits notes..."
                />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="submit" disabled={loading}>
                    {loading ? <Loader size="sm" /> : initialData ? "Update Budget" : "Create Budget"}
                </Button>
            </div>
        </form>
    );
};

export default BudgetForm;

