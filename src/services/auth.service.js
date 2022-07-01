import axios from "axios";
const API_URL = process.env.VUE_APP_API_URL;

class AuthService{
    login(user) {
        return axios.post(API_URL + 'login', {
            email: user.email,
            password: user.password
        }).then(response => {
            if(response.data.api_token) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }

            return response.data;
        });
    }
    logout() {
        localStorage.removeItem('user');
    }
    register(user) {
        return axios.post(API_URL + 'register', {
            name: user.name,
            email: user.email,
            password: user.password,
            password_confirmation: user.passwordConfirm,
        });
    }
}
export default new AuthService();