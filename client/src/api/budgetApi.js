import API from "./axios";

export const getBudgets = () => {
    return API.get("/budgets");
};

export const createBudget = (data) => {
    return API.post("/budgets", data);
};

export const updateBudget = (id, data) => {
    return API.put(`/budgets/${id}`, data);
};

export const deleteBudget = (id) => {
    return API.delete(`/budgets/${id}`);
};

