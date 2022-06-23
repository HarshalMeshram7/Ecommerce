import axios from "axios";
import { MAIN_URL } from "./apiConfig";

//USER LOGIN
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
// USER REGISTER
export const register = async ({ email, password }) => {
    try {
        const res = await axios.post(`${MAIN_URL}/user/register`, {
            email,
            password,
        });
        return res.data;
    } catch (error) {
        throw error;
    }
};

