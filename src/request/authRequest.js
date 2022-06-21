import axios from "axios";
import { MAIN_URL } from "./apiConfig";

//ADMIN LOGIN
export const login = async ({ email, password }) => {
    try {
        const res = await axios.post(`${MAIN_URL}/admin/login_admin/`, {
            email,
            password,
        });
        return res.data.response_data;
    } catch (error) {
        throw error;
    }
};