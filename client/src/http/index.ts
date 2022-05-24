//Здесь мы будем настраивать аксиос
import axios from "axios";
import { config } from "process";
import { AuthResponse } from "../models/response/AuthResponse";

export const API_URL = `http://localhost:5000/api`

const $api = axios.create({
    withCredentials:true,
    baseURL: API_URL
})

//Вешаем интерцепторы на запрос и ответ(1.15 на видео)
$api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    return config
})

//Перезаписываем токен, если нам пришел 401 статус(аксесс токен умер)
$api.interceptors.response.use((config) => {
    return config
}, async (error => {
    const orginalRequest = error.config
    if(error.response.status == 401 && error.config && !error.config._isRetry){
        orginalRequest._isRetry = true
        try{
            const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {withCredentials: true})
            localStorage.setItem('token', response.data.accessToken)
            return $api.request(orginalRequest)
        }catch(e){
            console.log('Пользователь не авторизован');
            
        }
    }
    throw error
}))

export default $api