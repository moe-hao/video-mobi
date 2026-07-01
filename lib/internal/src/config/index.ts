const config = {
    AppServerPort: Number(process.env.APP_SERVER_PORT || 3000),
    AppEnv: process.env.APP_ENV || 'dev',

    AuthTokenSecret: process.env.AUTH_TOKEN_SECRET || 'test_hono_secret',
    EncryptSecret: process.env.ENCRYPT_SECRET || 'test_hono_secret',
    EncryptVector: process.env.ENCRYPT_VECTOR || 'test_hono_vector',

    DatabaseHost: process.env.DATABASE_HOST || 'localhost',
    DatabasePort: Number(process.env.DATABASE_PORT || 3306),
    DatabaseUsername: process.env.DATABASE_USERNAME || 'root',
    DatabasePassword: process.env.DATABASE_PASSWORD || '',
    DatabaseName: process.env.DATABASE_NAME || 'database_name',

    RedisHost: process.env.REDIS_HOST || 'localhost',
    RedisPort: Number(process.env.REDIS_PORT || 6379),

    EmailResendHost: process.env.EMAIL_RESEND_HOST || 'https://api.resend.com/emails',
    EmailResendKey: process.env.EMAIL_RESEND_KEY || '',
    EmailResendFrom: process.env.EMAIL_RESEND_FROM || '',

    VolAccessKeyId: process.env.VOL_ACCESS_KEY_ID || '',
    VolSecretKey: process.env.VOL_SECRET_KEY || '',
    VolServiceName: process.env.VOL_SERVICE_NAME || '',

    VolRegion: process.env.VOL_REGION || '',
    VolSpaceName: process.env.VOL_SPACE_NAME || '',

    VolTosEndpoint: process.env.VOL_TOS_ENDPOINT || '',
    VolTosUrl: process.env.VOL_TOS_URL || '',

    PayermaxHost: process.env.PAYERMAX_HOST || '',
    PayermaxPrivateKey: process.env.PAYERMAX_PRIVATE_KEY || '',
    PayermaxPublicKey: process.env.PAYERMAX_PUBLIC_KEY || '',
    PayermaxAppId: process.env.PAYERMAX_APP_ID || '',
    PayermaxMerchantNo: process.env.PAYERMAX_MERCHANT_NO || '',
    PayermaxFrontCallbackPath: process.env.PAYERMAX_FRONT_CALLBACK_PATH || '',
    PayermaxPaymentNotifyUrl: process.env.PAYERMAX_PAYMENT_NOTIFY_URL || '',
    PayermaxSubscriptionNotifyUrl: process.env.PAYERMAX_SUBSCRIPTION_NOTIFY_URL || '',

    PaypalClientId: process.env.PAYPAL_CLIENT_ID || '',
    PaypalSecret: process.env.PAYPAL_SECRET || '',

    PayssionApiKey: process.env.PAYSSION_API_KEY || '',
    PayssionWebhookSecret: process.env.PAYSSION_WEBHOOK_SECRET || '',

    FbAccessToken: process.env.FB_ACCESS_TOKEN || '',
}

export default config;
