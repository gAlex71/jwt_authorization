require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const router = require('./router/index')
const errorMiddleware = require('./middlewares/error-middleware')
const PORT = process.env.PORT || 5000
const app = express()

//Блок с подключением middlewares
app.use(express.json())
app.use(cookieParser())
//С каким доменом придется обмениваться куками
app.use(cors({
    //Разрешаем куки
    credentials: true,
    origin: process.env.CLIENT_URL
}));
//Первый параметр - маршрут, по которому будем обрабатывать, второй - сам роутер
app.use('/api', router)
//Миддлвеер с обработкой ошибок всегда должен идти последним
app.use(errorMiddleware())


const start = async() => {
    try{
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        app.listen(PORT, () => console.log(`Server started on PORT = ${PORT} `))
    } catch(e){
        console.log(e);
    }
}

start()