import axios from "axios";
import authHeader from "./auth-header";

const API_URL = process.env.VUE_APP_API_URL;

class UserService {
    getProductsData(limit=20, page=1, sort_by='id', order_by='asc', search=null) {
        return axios.get(API_URL + 'products', {
            params: {
                limit: limit,
                sort_by: sort_by,
                search: search,
                order_by: order_by,
                page: page

            }
        });
    }
    getProductData(productId, data) {
        return axios.get(API_URL + 'products/' + productId, data);
    }
    putProductData(productId, data) {
        return axios.put(API_URL + 'products/' + productId, 
        {
            name: data.name,
            description: data.description,
            salary: data.salary,
        },
        {
            headers: authHeader(),
        });
    }
    postProductData(data) {
        return axios.post(API_URL + 'products', 
        {
            name: data.name,
            description: data.description,
            salary: data.salary,
        },
        {
            headers: authHeader(),
        });
    }
    deleteProductData(productId) {
        return axios.delete(API_URL + 'products/' + productId, {
            headers: authHeader()
        });
    }
}

export default new UserService();