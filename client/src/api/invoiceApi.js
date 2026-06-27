import API from "./axios";

export const getInvoices = (page = 1, search = "") => {
    return API.get(
        `/invoices?page=${page}&search=${search}`
    );
};

export const createInvoice = (data) => {
    return API.post(
        "/invoices/create",
        data
    );
};

export const updateInvoice = (id, data) => {
    return API.put(
        `/invoices/${id}`,
        data
    );
};

export const deleteInvoice = (id) => {
    return API.delete(
        `/invoices/${id}`
    );
};

export const getInvoice = (id) => {
    return API.get(
        `/invoices/${id}`
    );
};

export const downloadInvoicePdf = (id) => {
    return API.get(`/invoices/${id}/pdf`, {
        responseType: "blob", // ← critical for PDF download
    });
};

export const sendInvoice = (id) => {
    return API.post(`/invoices/${id}/send`);
};