import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { Context } from '.';
import LoginForm from './components/LoginForm';
import { IUser } from './models/IUser';
import UserService from './services/UserService';

function App() {
  const {store} = useContext(Context)
  const [users, setUsers] = useState<IUser[]>([])

  //Будет отрабатывать только при первом запуске приложения
  useEffect(() =>{
    //Если в локал сторедж что-то есть по этому ключу, то вызываем экшин
    if(localStorage.getItem('token')){
      store.checkAuth()
    }
  }, [])

  //Функция с помощью которой получаем пользователей
  //Когда эта функция вызовется, у нас в состоянии будет список пользователей
  async function getUsers(){
    try{
      const response = await UserService.fetchUsers()
      //То что нам вернет сервер, мы помещаем в наше состояние
      setUsers(response.data)
    } catch(e){
      console.log(e);
    }
  }

  if(store.isLoading){
    return <div>Загрузка...</div>
  }

  //Если пользователь не авторизован, то возвращаем LoginForm
  if(!store.isAuth){
    return(
      <LoginForm/>
    )
  }

  return (
    <div>
      <h1>{store.isAuth ? `Пользователь авторизован ${store.user.email}` : 'Авторизуйтесь!'}</h1>
      <h1>{store.user.isActivated ? 'Аккаунт подтвержден по почте' : 'Подтвердите аккаунт!'}</h1>
      <button onClick={() => store.logout()}>Выйти</button>
      <div>
        <button onClick={getUsers}>Получить пользователей</button>
      </div>
      {users.map(user =>
        <div key={user.email}>{user.email}</div>  
      )}
    </div>
  );
}

//mobx не может отслеживать какие либо изменения в данных без функции observer
export default observer(App);
