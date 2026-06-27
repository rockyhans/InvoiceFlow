import api from "./axios";

export const getQuotes = (page = 1, search = "") => {
    return api.get("/quotes", {
        params: {
            page,
            search,
        },
    });
};

export const getQuoteById = (id) => {
    return api.get(`/quotes/${id}`);
};

export const createQuote = (quoteData) => {
    return api.post("/quotes", quoteData);
};

export const updateQuote = (id, quoteData) => {
    return api.put(`/quotes/${id}`, quoteData);
};

export const deleteQuote = (id) => {
    return api.delete(`/quotes/${id}`);
};