import API from "./axios";

export const getClients = (page = 1, search = "") => {

    return API.get(
        `/clients?page=${page}&search=${search}`
    );

};

export const createClient = (data) => {

    return API.post("/clients", data);

};

export const updateClient = (id, data) => {

    return API.put(`/clients/${id}`, data);

};

export const deleteClient = (id) => {

    return API.delete(`/clients/${id}`);

};

export const getClient = (id) => {

    return API.get(`/clients/${id}`);

};