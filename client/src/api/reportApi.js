import API from "./axios";

export const getFinancialReport = () => {
    return API.get("/reports");
};

