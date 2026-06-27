import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import { getClients } from "../api/clientApi";
import { getQuotes } from "../api/quoteApi";
import { getInvoices } from "../api/invoiceApi";


const Dashboard = () => {
    const [stats, setStats] = useState({
        clients: 0,
        quotes: 0,
        invoices: 0,
        revenue: 0,
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            setLoading(true);

            const [
                clientsResponse,
                quotesResponse,
                invoicesResponse,
            ] = await Promise.all([
                getClients(),
                getQuotes(),
                getInvoices(),
            ]);

            const clients =
                clientsResponse?.data?.data?.clients ||
                clientsResponse?.data?.data ||
                [];

            console.log("Clients:", clientsResponse);



            const quotes =
                quotesResponse?.data?.quotes ||
                quotesResponse?.data?.data ||
                [];

            const invoices =
                invoicesResponse?.data?.invoices ||
                invoicesResponse?.data?.data ||
                [];

            let revenue = 0;

            invoices.forEach((invoice) => {
                revenue += Number(
                    invoice.total ||
                    invoice.grandTotal ||
                    invoice.amount ||
                    0
                );
            });

            setStats({
                clients: clients.length,
                quotes: quotes.length,
                invoices: invoices.length,
                revenue,
            });
        } catch (error) {
            console.error("Dashboard Error:", error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        console.log("Stats:", stats);
    }, [stats]);


    return (
        <DashboardLayout>
            <div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

                    <div className="bg-white rounded-xl shadow p-6">
                        <h3 className="text-gray-500 font-medium border-b border-gray-200 pb-2">
                            Total Clients
                        </h3>

                        <h1 className="text-4xl mt-4 font-bold text-blue-800">
                            {loading ? "..." : stats.clients}
                        </h1>
                    </div>

                    <div className="bg-white rounded-xl shadow p-6">
                        <h3 className="text-gray-500 font-medium border-b border-gray-200 pb-2">
                            Total Quotes
                        </h3>

                        <h1 className="text-4xl mt-4 font-bold text-blue-800">
                            {loading ? "..." : stats.quotes}
                        </h1>
                    </div>

                    <div className="bg-white rounded-xl shadow p-6">
                        <h3 className="text-gray-500 font-medium border-b border-gray-200 pb-2">
                            Total Invoices
                        </h3>

                        <h1 className="text-4xl mt-4 font-bold text-blue-800">
                            {loading ? "..." : stats.invoices}
                        </h1>
                    </div>

                    <div className="bg-white rounded-xl shadow p-6">
                        <h3 className="text-gray-500 font-medium border-b border-gray-200 pb-2">
                            Revenue
                        </h3>

                        <h1 className="text-4xl mt-4 font-bold text-green-600">
                            {loading
                                ? "..."
                                : `₹${stats.revenue.toLocaleString("en-IN")}`}
                        </h1>
                    </div>

                </div>
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;