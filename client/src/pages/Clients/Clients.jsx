import { useEffect, useState } from "react";

import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";

import DataTable from "../../components/table/DataTable";
import TablePagination from "../../components/table/TablePagination";

import Modal from "../../components/modal/Modal";
import ConfirmModal from "../../components/modal/ConfirmModal";

import ClientForm from "./ClientForm";

import {
    getClients,
    createClient,
    updateClient,
    deleteClient,
} from "../../api/clientApi";

import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const Clients = () => {

    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [modalOpen, setModalOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);

    const fetchClients = async () => {
        try {
            setLoading(true);
            const { data } = await getClients(page, search);
            setClients(data.data.clients);
            setTotalPages(data.data.totalPages);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, [page, search]);

    const handleCreate = async (formData) => {
        try {
            setSubmitLoading(true);
            await createClient(formData);
            setModalOpen(false);
            fetchClients();
        } catch (error) {
            alert(error.response.data.message);
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleUpdate = async (formData) => {
        try {
            setSubmitLoading(true);
            await updateClient(selectedClient._id, formData);
            setSelectedClient(null);
            setModalOpen(false);
            fetchClients();
        } catch (error) {
            alert(error.response.data.message);
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            setDeleteLoading(true);
            await deleteClient(selectedClient._id);
            setDeleteOpen(false);
            fetchClients();
        } catch (error) {
            console.log(error);
        } finally {
            setDeleteLoading(false);
        }
    };

    const columns = [
        {
            header: "Name",
            accessor: "name",
        },
        {
            header: "Company",
            accessor: "companyName",
        },
        {
            header: "Email",
            accessor: "email",
        },
        {
            header: "Phone",
            accessor: "phone",
        },
        {
            header: "Actions",
            render: (row) => (
                <div className="flex gap-3 cursor-pointer">
                    <button
                        onClick={() => {
                            setSelectedClient(row);
                            setModalOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                    >
                        <FaEdit />
                    </button>
                    <button
                        onClick={() => {
                            setSelectedClient(row);
                            setDeleteOpen(true);
                        }}
                        className="text-red-500 hover:text-red-700 transition-colors"
                    >
                        <FaTrash />
                    </button>
                </div>
            ),
        },
    ];

    const openCreateModal = () => {
        setSelectedClient(null);
        setModalOpen(true);
    };

    const handleSearch = (e) => {
        setPage(1);
        setSearch(e.target.value);
    };

    return (
        <DashboardLayout>
            <Card>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <h1 className="text-2xl font-bold">Clients</h1>

                    <div className="flex gap-3">
                        <input
                            type="text"
                            placeholder="Search client..."
                            value={search}
                            onChange={handleSearch}
                            className="border rounded-lg px-4 py-2 w-64 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Button onClick={openCreateModal}>
                            <div className="flex items-center gap-2 cursor-pointer">
                                <FaPlus />
                                <span>Add Client</span>
                            </div>
                        </Button>
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={clients}
                    loading={loading}
                    emptyMessage="No Clients Found"
                />

                {totalPages > 1 && (
                    <TablePagination
                        page={page}
                        totalPages={totalPages}
                        onPrev={() => setPage((prev) => Math.max(prev - 1, 1))}
                        onNext={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    />
                )}
            </Card>

            <Modal
                isOpen={modalOpen}
                title={selectedClient ? "Edit Client" : "Add Client"}
                onClose={() => {
                    setModalOpen(false);
                    setSelectedClient(null);
                }}
            >
                <ClientForm
                    initialData={selectedClient}
                    onSubmit={selectedClient ? handleUpdate : handleCreate}
                    submitLoading={submitLoading}
                />
            </Modal>

            <ConfirmModal
                open={deleteOpen}
                onClose={() => {
                    setDeleteOpen(false);
                    setSelectedClient(null);
                }}
                onConfirm={handleDelete}
                loading={deleteLoading}
            />
        </DashboardLayout>
    );

};

export default Clients;