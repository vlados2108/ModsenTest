import { env } from "process"

export default () =>({
    port : parseInt(process.env.PORT,10)||3000,
    databaseUrl: env.DATABASE_URL,
    secretKey: process.env.SECRET_KEY,
    accessExpiresIn : process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
    isPublicKey: process.env.IS_PUBLIC_KEY,
})