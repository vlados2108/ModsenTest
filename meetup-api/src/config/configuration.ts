import { env } from "process"

export default () =>({
    port : parseInt(process.env.PORT,10)||3000,
    databaseUrl: env.DATABASE_URL,
    secretKey: process.env.SECRET_KEY,
    isPublicKey: process.env.IS_PUBLIC_KEY,
})