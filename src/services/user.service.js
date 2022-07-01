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
        data.append('headers', authHeader());
        return axios.put(API_URL + 'products/' + productId, data);
    }
    postProductData(productId, data) {
        data.append('headers', authHeader());
        return axios.post(API_URL + 'products/' + productId, data);
    }
    deleteProductData(productId) {
        return axios.delete(API_URL + 'products/' + productId, {
            headers: authHeader()
        });
    }
}

export default new UserService();