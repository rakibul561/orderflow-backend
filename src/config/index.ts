import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
    node_env: process.env.NODE_ENV,
    port: process.env.PORT,
    database_url: process.env.DATABASE_URL,

   
    jwt: {
        jwt_secret: process.env.JWT_SECRET,
        expires_in: process.env.JWT_EXPIRES_IN,
        refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
        refresh_token_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN,
     
    },
    salt_round: process.env.SALT_ROUND,
    stripe_secret_key: process.env.STRIPE_SECRET_KEY,
    frontendUrl: process.env.FORTEND_URL,
    webhook_secret: process.env.WEBHOOK_SECRET,   
}