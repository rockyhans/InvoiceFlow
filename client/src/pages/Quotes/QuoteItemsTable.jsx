import { FaPlus, FaTrash } from "react-icons/fa";

const QuoteItemsTable = ({ items, setItems }) => {

    const handleChange = (index, field, value) => {

        const updatedItems = [...items];

        updatedItems[index][field] = value;

        const quantity =
            Number(updatedItems[index].quantity) || 0;

        const price =
            Number(updatedItems[index].price) || 0;

        const tax =
            Number(updatedItems[index].tax) || 0;

        updatedItems[index].amount =
            quantity * price + tax;

        setItems(updatedItems);

    };

    const addRow = () => {

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

    const removeRow = (index) => {

        if (items.length === 1) return;

        const updatedItems = items.filter(
            (_, i) => i !== index
        );

        setItems(updatedItems);

    };

    return (

        <div className="space-y-4">

            <div className="flex justify-between">

                <h2 className="text-lg font-semibold">
                    Quote Items
                </h2>

                <button
                    type="button"
                    onClick={addRow}
                    className="flex items-center gap-2 text-blue-600"
                >
                    <FaPlus />

                    Add Item
                </button>

            </div>

            <div className="overflow-x-auto">

                <table className="w-full border rounded-lg">

                    <thead className="bg-gray-100">

                        <tr>

                            <th className="p-2">
                                Description
                            </th>

                            <th className="p-2">
                                Qty
                            </th>

                            <th className="p-2">
                                Price
                            </th>

                            <th className="p-2">
                                Tax
                            </th>

                            <th className="p-2">
                                Amount
                            </th>

                            <th className="p-2">
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
                                            handleChange(
                                                index,
                                                "description",
                                                e.target.value
                                            )
                                        }
                                        className="w-full border rounded px-2 py-1"
                                    />

                                </td>

                                <td className="p-2">

                                    <input
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) =>
                                            handleChange(
                                                index,
                                                "quantity",
                                                e.target.value
                                            )
                                        }
                                        className="w-20 border rounded px-2 py-1"
                                    />

                                </td>

                                <td className="p-2">

                                    <input
                                        type="number"
                                        min="0"
                                        value={item.price}
                                        onChange={(e) =>
                                            handleChange(
                                                index,
                                                "price",
                                                e.target.value
                                            )
                                        }
                                        className="w-24 border rounded px-2 py-1"
                                    />

                                </td>

                                <td className="p-2">

                                    <input
                                        type="number"
                                        min="0"
                                        value={item.tax}
                                        onChange={(e) =>
                                            handleChange(
                                                index,
                                                "tax",
                                                e.target.value
                                            )
                                        }
                                        className="w-20 border rounded px-2 py-1"
                                    />

                                </td>

                                <td className="p-2 font-semibold">

                                    ₹ {item.amount}

                                </td>

                                <td className="p-2">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeRow(index)
                                        }
                                        className="text-red-600"
                                    >
                                        <FaTrash />
                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>

    );

};

export default QuoteItemsTable;