import { useEffect, useState } from "react";

import DashboardLayout from "../../layouts/DashboardLayout";

import Card from "../../components/common/Card";
import Button from "../../components/common/Button";

import DataTable from "../../components/table/DataTable";
import TablePagination from "../../components/table/TablePagination";

import Modal from "../../components/modal/Modal";
import ConfirmModal from "../../components/modal/ConfirmModal";

import InvoiceForm from "./InvoiceForm";

import {
    getInvoices,
    createInvoice,
    updateInvoice,
    deleteInvoice,
} from "../../api/invoiceApi";

import {
    FaEdit,
    FaTrash,
    FaPlus,
} from "react-icons/fa";
import { FaEye } from "react-icons/fa6";
import { Navigate, useNavigate } from "react-router-dom";

const Invoices = () => {

        const navigate = useNavigate();


    const [invoices, setInvoices] = useState([]);

    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");

    const [page, setPage] = useState(1);

    const [totalPages, setTotalPages] = useState(1);

    const [modalOpen, setModalOpen] = useState(false);

    const [deleteOpen, setDeleteOpen] = useState(false);

    const [selectedInvoice, setSelectedInvoice] =
        useState(null);

   const fetchInvoices = async () => {
    try {
        setLoading(true);

        const { data } = await getInvoices(page, search);

        setInvoices(data.data);        // ✅ not data.data.invoices
        setTotalPages(data.pages);     // ✅ not data.data.totalPages

    } catch (error) {
        console.log(error);
    } finally {
        setLoading(false);
    }
};

    useEffect(() => {

        fetchInvoices();

    }, [page, search]);


    const handleCreate = async (
    formData
) => {

    try {

        await createInvoice(formData);

        setModalOpen(false);

        fetchInvoices();

    } catch (error) {

        alert(
            error.response?.data?.message ||
            "Something went wrong"
        );

    }

};

const handleUpdate = async (
    formData
) => {

    try {

        await updateInvoice(
            selectedInvoice._id,
            formData
        );

        setSelectedInvoice(null);

        setModalOpen(false);

        fetchInvoices();

    } catch (error) {

        alert(
            error.response?.data?.message ||
            "Something went wrong"
        );

    }

};

const handleDelete = async () => {

    try {

        await deleteInvoice(
            selectedInvoice._id
        );

        setDeleteOpen(false);

        fetchInvoices();

    } catch (error) {

        console.log(error);

    }

};

const columns = [

    {
        header: "Invoice No",
        accessor: "invoiceNumber",
    },

    {
        header: "Client",

        render: (row) => row.client?.name,
    },

    {
        header: "Issue Date",

        render: (row) =>
            new Date(
                row.issueDate
            ).toLocaleDateString(),
    },

    {
        header: "Due Date",

        render: (row) =>
            new Date(
                row.dueDate
            ).toLocaleDateString(),
    },

    {
        header: "Total",

        render: (row) => `₹ ${row.total}`,
    },

    {
        header: "Status",

        accessor: "status",
    },

    {
        header: "Actions",

        render: (row) => (

            <div className="flex gap-4 cursor-pointer">

                <button

                    onClick={() => {

                        setSelectedInvoice(
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

                        setSelectedInvoice(
                            row
                        );

                        setDeleteOpen(true);

                    }}

                    className="text-red-600 cursor-pointer"

                >

                    <FaTrash />

                </button>

                <button
                onClick={() => navigate(`/invoices/${row._id}`)}
                className="text-green-600 cursor-pointer"
            >
                <FaEye />
            </button>

            </div>

        ),
    },

//     {
//     header: "Actions",
//     render: (row) => (
//         <div className="flex gap-3">
//             <button
//                 onClick={() => navigate(`/invoices/${row._id}`)}
//                 className="text-green-600"
//             >
//                 <FaEye />
//             </button>
//         </div>
//     ),
// }

];

const openCreateModal = () => {

    setSelectedInvoice(null);

    setModalOpen(true);

};

const handleSearch = (e) => {

    setPage(1);

    setSearch(
        e.target.value
    );

};

return (
    <DashboardLayout>
        <Card>


            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

                <h1 className="text-2xl font-bold">

                    Invoices

                </h1>

                <div className="flex gap-3">

                    <input
                        type="text"
                        placeholder="Search invoice..."
                        value={search}
                        onChange={handleSearch}
                        className="border rounded-lg px-4 py-2 w-64 outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <Button
                        onClick={openCreateModal}
                    >

                        <div className="flex items-center gap-2">

                            <FaPlus />

                            <span className="cursor-pointer">

                                Add Invoice

                            </span>

                        </div>

                    </Button>

                </div>

            </div>


            <DataTable
                columns={columns}
                data={invoices}
                loading={loading}
                emptyMessage="No Invoices Found"
            />


            {

                totalPages > 1 && (

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
                                Math.min(
                                    prev + 1,
                                    totalPages
                                )
                            )
                        }

                    />

                )

            }

        </Card>


        <Modal

            isOpen={modalOpen}

            title={
                selectedInvoice
                    ? "Edit Invoice"
                    : "Add Invoice"
            }

            onClose={() => {

                setModalOpen(false);

                setSelectedInvoice(null);

            }}

        >

            <InvoiceForm

                initialData={selectedInvoice}

                onSubmit={
                    selectedInvoice
                        ? handleUpdate
                        : handleCreate
                }

            />

        </Modal>


        <ConfirmModal

            open={deleteOpen}

            onClose={() => {

                setDeleteOpen(false);

                setSelectedInvoice(null);

            }}

            onConfirm={handleDelete}

        />

    </DashboardLayout>
);

};

export default Invoices;
