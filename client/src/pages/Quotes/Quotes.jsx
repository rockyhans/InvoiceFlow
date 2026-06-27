import { useEffect, useState } from "react";

import DashboardLayout from "../../layouts/DashboardLayout";

import Card from "../../components/common/Card";
import Button from "../../components/common/Button";

import DataTable from "../../components/table/DataTable";
import TablePagination from "../../components/table/TablePagination";

import Modal from "../../components/modal/Modal";
import ConfirmModal from "../../components/modal/ConfirmModal";

import QuoteForm from "./QuoteForm";

import {
    getQuotes,
    createQuote,
    updateQuote,
    deleteQuote,
} from "../../api/quoteApi";

import {
    FaEdit,
    FaTrash,
    FaPlus,
} from "react-icons/fa";

const Quotes = () => {

    const [quotes, setQuotes] = useState([]);

    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");

    const [page, setPage] = useState(1);

    const [totalPages, setTotalPages] = useState(1);

    const [modalOpen, setModalOpen] = useState(false);

    const [deleteOpen, setDeleteOpen] = useState(false);

    const [selectedQuote, setSelectedQuote] =
        useState(null);

    const fetchQuotes = async () => {

        try {

            setLoading(true);

            const { data } = await getQuotes(
                page,
                search
            );

            setQuotes(data.data);

            setTotalPages(data.pages);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        fetchQuotes();

    }, [page, search]);

    const handleCreate = async (
        formData
    ) => {

        try {

            await createQuote(formData);

            setModalOpen(false);

            fetchQuotes();

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Failed to create quote."
            );

        }

    };

    const handleUpdate = async (
        formData
    ) => {

        try {

            await updateQuote(
                selectedQuote._id,
                formData
            );

            setSelectedQuote(null);

            setModalOpen(false);

            fetchQuotes();

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Failed to update quote."
            );

        }

    };

    const handleDelete = async () => {

        try {

            await deleteQuote(
                selectedQuote._id
            );

            setDeleteOpen(false);

            fetchQuotes();

        } catch (error) {

            console.log(error);

        }

    };

    const columns = [

        {
            header: "Quote No",

            accessor: "quoteNumber",
        },

        {
            header: "Client",

            render: (row) =>
                row.client?.name,
        },

        {
            header: "Issue Date",

            render: (row) =>
                new Date(
                    row.issueDate
                ).toLocaleDateString(),
        },

        {
            header: "Expiry Date",

            render: (row) =>
                new Date(
                    row.expiryDate
                ).toLocaleDateString(),
        },

        {
            header: "Total",

            render: (row) =>
                `₹ ${row.total}`,
        },

        {
            header: "Status",

            accessor: "status",
        },

        {
            header: "Actions",

            render: (row) => (

                <div className="flex gap-3">

                    <button

                        onClick={() => {

                            setSelectedQuote(
                                row
                            );

                            setModalOpen(true);

                        }}

                        className="text-blue-600 cursor-pointer"

                    >

                        <FaEdit />

                    </button>

                    <button

                        onClick={() => {

                            setSelectedQuote(
                                row
                            );

                            setDeleteOpen(true);

                        }}

                        className="text-red-600 cursor-pointer"

                    >

                        <FaTrash />

                    </button>

                </div>

            ),
        },

    ];

    const openCreateModal = () => {

        setSelectedQuote(null);

        setModalOpen(true);

    };

    const handleSearch = (e) => {

        setPage(1);

        setSearch(e.target.value);

    };

    return (

        <DashboardLayout>

            <Card>

                {/* Header */}

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

                    <h1 className="text-2xl font-bold">

                        Quotes

                    </h1>

                    <div className="flex gap-3">

                        <input
                            type="text"
                            placeholder="Search Quote..."
                            value={search}
                            onChange={handleSearch}
                            className="border rounded-lg px-4 py-2 w-64 outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <Button onClick={openCreateModal}>

                            <div className="flex items-center gap-2 cursor-pointer">

                                <FaPlus />

                                <span>New Quote</span>

                            </div>

                        </Button>

                    </div>

                </div>

                {/* Quotes Table */}

                <DataTable
                    columns={columns}
                    data={quotes}
                    loading={loading}
                    emptyMessage="No Quotes Found"
                />

                {/* Pagination */}

                {totalPages > 1 && (

                    <TablePagination
                        page={page}
                        totalPages={totalPages}
                        onPrev={() =>
                            setPage((prev) =>
                                Math.max(prev - 1, 1)
                            )
                        }
                        onNext={() =>
                            setPage((prev) =>
                                Math.min(prev + 1, totalPages)
                            )
                        }
                    />

                )}

            </Card>

            {/* Add / Edit Quote */}

            <Modal
                isOpen={modalOpen}
                title={
                    selectedQuote
                        ? "Edit Quote"
                        : "Create Quote"
                }
                onClose={() => {

                    setModalOpen(false);

                    setSelectedQuote(null);

                }}
            >

                <QuoteForm
                    initialData={selectedQuote}
                    onSubmit={
                        selectedQuote
                            ? handleUpdate
                            : handleCreate
                    }
                />

            </Modal>

            {/* Delete Confirmation */}

            <ConfirmModal
                open={deleteOpen}
                onClose={() => {

                    setDeleteOpen(false);

                    setSelectedQuote(null);

                }}
                onConfirm={handleDelete}
            />

        </DashboardLayout>

    );

};

export default Quotes;