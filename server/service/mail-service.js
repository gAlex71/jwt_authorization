//Сервис для работы с почтой
const nodemailer = require('nodemailer')

class MailService{
    //Инициализируем почтовый клиент
    constructor(){
        //Транспортер предназначен для отправки письма клиенту
        this.transporter = nodemailer.createTransport({
            //Все элементы находятся в настройках почты
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth:{
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        })
    }

    async sendActivationMail(to, link){
        //Отправляем письмо
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Акцивация аккаунта на ' + process.env.API_URL,
            text: '',
            html:
                `
                    <div>
                        <h1>Для активации перейдите по ссылке<h1>
                        <a href="${link}">${link}</a>
                    </div>
                `
        })
    }
}

module.exports = new MailService()