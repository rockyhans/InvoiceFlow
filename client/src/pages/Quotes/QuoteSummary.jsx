const QuoteSummary = ({
    subtotal,
    formData,
    setFormData,
    total,
}) => {

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: Number(e.target.value),
        });

    };

    return (

        <div className="flex justify-end">

            <div className="w-full md:w-96 border rounded-lg p-5 bg-gray-50">

                <h2 className="text-lg font-semibold mb-4">
                    Quote Summary
                </h2>

                {/* Subtotal */}

                <div className="flex justify-between mb-3">

                    <span>Subtotal</span>

                    <span className="font-semibold">
                        ₹ {subtotal.toFixed(2)}
                    </span>

                </div>


                <div className="flex justify-between items-center mb-3">

                    <label>
                        Discount
                    </label>

                    <input
                        type="number"
                        name="discount"
                        value={formData.discount}
                        onChange={handleChange}
                        className="w-28 border rounded px-2 py-1 text-right"
                    />

                </div>


                <div className="flex justify-between items-center mb-3">

                    <label>
                        Tax
                    </label>

                    <input
                        type="number"
                        name="tax"
                        value={formData.tax}
                        onChange={handleChange}
                        className="w-28 border rounded px-2 py-1 text-right"
                    />

                </div>

                <hr className="my-4" />


                <div className="flex justify-between text-xl font-bold">

                    <span>Total</span>

                    <span>
                        ₹ {total.toFixed(2)}
                    </span>

                </div>

            </div>

        </div>

    );

};

export default QuoteSummary;