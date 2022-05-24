import { makeAutoObservable } from "mobx";
import { IUser } from "../models/IUser";
import AuthService from "../services/AuthService";
import axios from "axios";
import { AuthResponse } from "../models/response/AuthResponse";
import { API_URL } from "../http";

export default class Store{
    user = {} as IUser
    isAuth = false
    isLoading = false

    constructor(){
        makeAutoObservable(this)
    }
    
    //Мутация для изменения переменной isAuth и user
    setAuth(bool: boolean){
        this.isAuth = bool
    }
    //Мы заменяем текущее значение, на то, которое принимаем в параметрах
    setUser(user: IUser){
        this.user = user
    }

    setLoading(bool: boolean){
        this.isLoading = bool
    }

    async login(email: string, password: string){
        try{
            const response = await AuthService.login(email, password)
            localStorage.setItem('token', response.data.accessToken)
            //Если все верно, делаем следующие действия
            this.setAuth(true)
            this.setUser(response.data.user)
        } catch(e){
            console.log(e.response?.data?.message);
        }
    }

    async registration(email: string, password: string){
        try{
            const response = await AuthService.registration(email, password)
            localStorage.setItem('token', response.data.accessToken)
            //Если все верно, делаем следующие действия
            this.setAuth(true)
            this.setUser(response.data.user)
        } catch(e){
            console.log(e.response?.data?.message);
        }
    }

    async logout(){
        try{
            const response = await AuthService.logout()
            localStorage.removeItem('token')
            //Если все верно, делаем следующие действия
            this.setAuth(false)
            this.setUser({} as IUser)
        } catch(e){
            console.log(e.response?.data?.message);
        }
    }

    //Получаем информацию о пользователе
    async checkAuth(){
        this.setLoading(true)
        try{
            const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {withCredentials: true})
            console.log(response);
            localStorage.setItem('token', response.data.accessToken)
            this.setAuth(true)
            this.setUser(response.data.user)
        } catch(e){
            console.log(e.response?.data?.message);   
        } finally{
            this.setLoading(false)
        }
    }
}