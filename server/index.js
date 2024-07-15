require('dotenv').config()
const Database = require('better-sqlite3')
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const router = require('./router/index')
const errorMiddlewares = require('./middlewares/error-middlewares')

const PORT = process.env.PORT
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}))
app.use('/api', router)
// middlewares для обработки ошибок должен быть последним
app.use(errorMiddlewares)

const start = async () => {
    try {
        // Соединение с БД
        const db = new Database('./test.db')

        // Удалить таблицу users
        // db.prepare('DROP TABLE users').run()

        // db.exec(
        // `CREATE TABLE users(
        //     id INTEGER PRIMARY KEY, 
        //     email,
        //     username,
        //     password,
        //     isActivated BOOLEAN,
        //     activationLink
        // )`)

        // const data = [
        //     {  email: 'master@mail.ru', username: 'Мастер', password: '$2b$04$C.xcyh6nLqfnyBLyZrmIx.WDCs5HZZWZwFUJUMr6lUYm84TMGuqWm', isActivated: 0, activationLink: 'b14519fa-a182-4a97-a593-d5d73507613b' }, 
        //     {  email: 'root@mail.ru', username: 'Root', password: '$2b$04$C.xcyh6nLqfnyBLyZrmIx.WDCs5HZZWZwFUJUMr6lUYm84TMGuqWm', isActivated: 0, activationLink: 'b44519fa-a182-4a97-a593-d5d73507613e' }, 
        //     {  email: 'super@mail.ru', username: 'Super', password: '$2b$04$C.xcyh6nLqfnyBLyZrmIx.WDCs5HZZWZwFUJUMr6lUYm84TMGuqWm', isActivated: 0, activationLink: 'b24519fa-a182-4a97-a593-d5d73507613a' }, 
        //     {  email: 'hello@mail.ru', username: 'Hello', password: '$2b$04$C.xcyh6nLqfnyBLyZrmIx.WDCs5HZZWZwFUJUMr6lUYm84TMGuqWm', isActivated: 0, activationLink: 'b34519fa-a182-4a97-a593-d5d73507613c' }, 
        // ]

        // const insertData = db.prepare(`
        //     INSERT INTO users(
        //         email,
        //         username,
        //         password,
        //         isActivated,
        //         activationLink
        //     ) VALUES (
        //         ?, ?, ?, ?, ?
        //     )`
        // )

        // data.forEach((user) => {
        //     insertData.run(
        //         user.email,
        //         user.username,
        //         user.password,
        //         user.isActivated,
        //         user.activationLink
        //     )
        // })


        // Удалить таблицу tokens
        // db.prepare('DROP TABLE tokens').run()

        // db.exec(
        // `CREATE TABLE tokens(
        //     id INTEGER PRIMARY KEY, 
        //     user,
        //     refrashToken
        // )`)


        // Удалить
        // db.prepare(
        // `DELETE FROM users WHERE email = ?`
        // ).run('user@mail.ru')

        // db.prepare(
        // `DELETE FROM tokens WHERE id = ?`
        // ).run(1)
                

        app.listen(PORT, () => console.log(`Server started on PORT = ${ PORT }`))
    } catch(e) {
        console.log(e)
    }
}

start()
