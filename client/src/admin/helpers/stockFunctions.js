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

const addStock = (values) => {
    return axios.post(`${API_URL}/stock/add`, values);
}

const updateStock = (values) => {
    return axios.post(`${API_URL}/stock/update`, values);
}

const getProductsWithStock = (id) => {
    return axios.post(`${API_URL}/stock/get-products-with-stock`, { id });
}

const getProductStock = (id) => {
    return axios.post(`${API_URL}/stock/get-product-stock`, { id });
}

export { getAllStocks, getSingleStock, deleteStock, addStock, updateStock, getProductStock, getProductsWithStock };
