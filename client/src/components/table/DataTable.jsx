const DataTable = ({
    columns,
    data,
    loading = false,
    emptyMessage = "No Data Found",
}) => {

    if (loading) {
        return (
            <div className="overflow-x-auto rounded-xl border">
                <table className="min-w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.accessor}
                                    className="px-5 py-3 text-left font-semibold text-gray-600"
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {[...Array(5)].map((_, i) => (
                            <tr key={i} className="border-t">
                                {columns.map((column) => (
                                    <td key={column.accessor} className="px-5 py-4">
                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    if (!data.length) {
        return (
            <div className="overflow-x-auto rounded-xl border">
                <table className="min-w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.accessor}
                                    className="px-5 py-3 text-left font-semibold text-gray-600"
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                </table>

                <div className="flex flex-col items-center justify-center py-16 px-4">
                    <div className="relative mb-5">
                        <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center animate-bounce">
                            <svg
                                className="w-9 h-9 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={1.5}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75.125v-1.5a1.125 1.125 0 011.125-1.125h.375m-3 0v-4.5A1.125 1.125 0 014.5 10.5h15a1.125 1.125 0 011.125 1.125v4.5m-3 0H6m0 0v1.5m0-1.5H3.375m15 0H20.625M6 15v1.5m12-1.5v1.5M6 10.5V6.375a1.125 1.125 0 011.125-1.125h9.75A1.125 1.125 0 0118 6.375V10.5"
                                />
                            </svg>
                        </div>
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </span>
                    </div>

                    <p className="text-gray-700 font-semibold text-base mb-1">{emptyMessage}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-xl border">
            <table className="min-w-full">
                <thead className="bg-gray-100">
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.accessor}
                                className="px-5 py-3 text-left font-semibold text-gray-600"
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {data.map((row) => (
                        <tr
                            key={row._id}
                            className="border-t hover:bg-gray-50 transition-colors duration-150"
                        >
                            {columns.map((column) => (
                                <td
                                    key={column.accessor}
                                    className="px-5 py-4 text-sm text-gray-700"
                                >
                                    {column.render
                                        ? column.render(row)
                                        : row[column.accessor]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

};

export default DataTable;