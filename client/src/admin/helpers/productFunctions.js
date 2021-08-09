import axios from "axios";
import settings from "./settings";

const { API_URL } = settings;

const getAllProducts = () => {
    return axios.get(`http://localhost:5000/product/get-all-products`);
}

const getProductDetails = (id) => {
    return axios.post(`http://localhost:5000/product/single-product`, { id });
}

const getProductCategories = (id) => {
    return axios.post(`http://localhost:5000/product/get-product-categories`, { id });
}

const deleteProductById = (id) => {
    return axios.post(`${API_URL}/product/delete`, { id });
}

const addAllergens = (id, allergens) => {
    return axios.post(`${API_URL}/product/add-allergens`, { id, allergens });
}

const getNewId = () => {
    return axios.get(`${API_URL}/product/last-product`);
}

const deleteProduct = (id) => {
    return axios.post(`${API_URL}/product/delete`, { id });
}

export { getAllProducts, deleteProductById, getProductDetails, addAllergens, getNewId, deleteProduct, getProductCategories };
