import API from "./axios";

export const getExpenses = (page = 1, search = "") => {
    return API.get(`/expenses?page=${page}&search=${search}`);
};

export const createExpense = (data) => {
    return API.post("/expenses", data);
};

export const updateExpense = (id, data) => {
    return API.put(`/expenses/${id}`, data);
};

export const deleteExpense = (id) => {
    return API.delete(`/expenses/${id}`);
};

