import { useEffect, useState } from "react";

import FormInput from "../../components/forms/FormInput";
import Button from "../../components/common/Button";

import { getClients } from "../../api/clientApi";

const QuoteForm = ({
    initialData,
    onSubmit,
}) => {

    const [clients, setClients] = useState([]);

    const [formData, setFormData] = useState({

        client: "",

        issueDate: "",

        expiryDate: "",

        discount: 0,

        tax: 0,

        notes: "",

        status: "Draft",

    });

    const [items, setItems] = useState([

        {
            description: "",
            quantity: 1,
            price: 0,
            tax: 0,
            amount: 0,
        },

    ]);

    useEffect(() => {

        fetchClients();

    }, []);

    useEffect(() => {

        if (initialData) {

            setFormData({

                client: initialData.client?._id || "",

                issueDate:
                    initialData.issueDate?.split("T")[0] || "",

                expiryDate:
                    initialData.expiryDate?.split("T")[0] || "",

                discount: initialData.discount,

                tax: initialData.tax,

                notes: initialData.notes,

                status: initialData.status,

            });

            setItems(initialData.items);

        }

    }, [initialData]);

    const fetchClients = async () => {

        try {

            const { data } = await getClients();

            setClients(data.data.clients);

        } catch (error) {

            console.log(error);

        }

    };

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value,

        });

    };

    const handleItemChange = (
        index,
        field,
        value
    ) => {

        const updatedItems = [...items];

        updatedItems[index][field] = value;

        const qty =
            Number(updatedItems[index].quantity);

        const price =
            Number(updatedItems[index].price);

        const tax =
            Number(updatedItems[index].tax);

        updatedItems[index].amount =
            qty * price + tax;

        setItems(updatedItems);

    };

    const addItem = () => {

        setItems([

            ...items,

            {
                description: "",
                quantity: 1,
                price: 0,
                tax: 0,
                amount: 0,
            },

        ]);

    };

    const removeItem = (index) => {

        if (items.length === 1) return;

        setItems(
            items.filter(
                (_, i) => i !== index
            )
        );

    };

    const subtotal = items.reduce(

        (sum, item) =>
            sum + Number(item.amount),

        0

    );

    const total =

        subtotal

        - Number(formData.discount)

        + Number(formData.tax);

    const handleSubmit = (e) => {

        e.preventDefault();

        onSubmit({

            ...formData,

            items,

            subtotal,

            total,

        });

    };

        return (

        <form
            onSubmit={handleSubmit}
            className="space-y-6"
        >

            {/* Client & Dates */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <div>

                    <label className="block mb-1 font-medium">

                        Client

                    </label>

                    <select
                        name="client"
                        value={formData.client}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg px-3 py-2"
                    >

                        <option value="">

                            Select Client

                        </option>

                        {clients.map((client) => (

                            <option
                                key={client._id}
                                value={client._id}
                            >

                                {client.name}

                            </option>

                        ))}

                    </select>

                </div>

                <FormInput
                    label="Issue Date"
                    type="date"
                    name="issueDate"
                    value={formData.issueDate}
                    onChange={handleChange}
                />

                <FormInput
                    label="Expiry Date"
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                />

            </div>

            {/* Quote Items */}

            <div>

                <div className="flex justify-between items-center mb-4">

                    <h2 className="text-lg font-semibold">

                        Quote Items

                    </h2>

                    <Button
                        type="button"
                        onClick={addItem}
                    >

                        + Add Item

                    </Button>

                </div>

                <div className="overflow-x-auto">

                    <table className="w-full border rounded-lg">

                        <thead className="bg-gray-100">

                            <tr>

                                <th className="p-3 text-left">

                                    Description

                                </th>

                                <th className="p-3">

                                    Qty

                                </th>

                                <th className="p-3">

                                    Price

                                </th>

                                <th className="p-3">

                                    Tax

                                </th>

                                <th className="p-3">

                                    Amount

                                </th>

                                <th className="p-3">

                                    Action

                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {items.map((item, index) => (

                                <tr key={index}>

                                    <td className="p-2">

                                        <input
                                            type="text"
                                            value={item.description}
                                            onChange={(e) =>
                                                handleItemChange(
                                                    index,
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full border rounded px-2 py-2"
                                            placeholder="Description"
                                            required
                                        />

                                    </td>

                                    <td className="p-2">

                                        <input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) =>
                                                handleItemChange(
                                                    index,
                                                    "quantity",
                                                    e.target.value
                                                )
                                            }
                                            className="w-20 border rounded px-2 py-2"
                                            required
                                        />

                                    </td>

                                    <td className="p-2">

                                        <input
                                            type="number"
                                            min="0"
                                            value={item.price}
                                            onChange={(e) =>
                                                handleItemChange(
                                                    index,
                                                    "price",
                                                    e.target.value
                                                )
                                            }
                                            className="w-24 border rounded px-2 py-2"
                                            required
                                        />

                                    </td>

                                    <td className="p-2">

                                        <input
                                            type="number"
                                            min="0"
                                            value={item.tax}
                                            onChange={(e) =>
                                                handleItemChange(
                                                    index,
                                                    "tax",
                                                    e.target.value
                                                )
                                            }
                                            className="w-20 border rounded px-2 py-2"
                                        />

                                    </td>

                                    <td className="p-2 font-semibold text-center">

                                        ₹ {item.amount.toFixed(2)}

                                    </td>

                                    <td className="p-2 text-center">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeItem(index)
                                            }
                                            className="text-red-600 hover:text-red-800 font-semibold"
                                        >

                                            Remove

                                        </button>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

                        {/* Quote Summary */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Notes */}

                <div>

                    <label className="block mb-2 font-medium">

                        Notes

                    </label>

                    <textarea
                        name="notes"
                        rows="6"
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Additional notes..."
                        className="w-full border rounded-lg px-3 py-2 resize-none"
                    />

                </div>

                {/* Totals */}

                <div className="border rounded-lg p-5 bg-gray-50">

                    <div className="flex justify-between mb-3">

                        <span className="font-medium">

                            Subtotal

                        </span>

                        <span>

                            ₹ {subtotal.toFixed(2)}

                        </span>

                    </div>

                    <div className="mb-3">

                        <FormInput
                            label="Discount"
                            type="number"
                            name="discount"
                            value={formData.discount}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="mb-3">

                        <FormInput
                            label="Tax"
                            type="number"
                            name="tax"
                            value={formData.tax}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="mb-4">

                        <label className="block mb-2 font-medium">

                            Status

                        </label>

                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2"
                        >

                            <option value="Draft">

                                Draft

                            </option>

                            <option value="Sent">

                                Sent

                            </option>

                            <option value="Accepted">

                                Accepted

                            </option>

                            <option value="Rejected">

                                Rejected

                            </option>

                        </select>

                    </div>

                    <hr className="my-4" />

                    <div className="flex justify-between text-xl font-bold">

                        <span>

                            Grand Total

                        </span>

                        <span className="text-blue-600">

                            ₹ {total.toFixed(2)}

                        </span>

                    </div>

                </div>

            </div>

            {/* Save Button */}

            <div className="flex justify-end">

                <Button type="submit">

                    {

                        initialData

                            ? "Update Quote"

                            : "Save Quote"

                    }

                </Button>

            </div>

        </form>

    );

};

export default QuoteForm;