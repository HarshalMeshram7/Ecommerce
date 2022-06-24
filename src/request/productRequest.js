import axios from "axios";
import { MAIN_URL } from "./apiConfig";

// GET ALL PRODUCTS
export const products = async () => {
    try {
        const res = await axios.get(`${MAIN_URL}/product/all-products`);
        return res.data;
    } catch (error) {
        throw error;
    }
};