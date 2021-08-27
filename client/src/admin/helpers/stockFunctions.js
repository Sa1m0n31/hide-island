import axios from "axios";
import settings from "./settings";

const { API_URL } = settings;

const getAllStocks = () => {
    return axios.get(`${API_URL}/stock/get-all`);
}

const getSingleStock = (id) => {
    return axios.post(`${API_URL}/stock/get-single`, { id });
}

const deleteStock = (id) => {
    return axios.post(`${API_URL}/stock/delete`, { id });
}

export { getAllStocks, getSingleStock, deleteStock };
