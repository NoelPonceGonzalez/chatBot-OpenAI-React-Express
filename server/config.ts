import dotonv from 'dotenv'

dotonv.config();

const config = {
    PORT: process.env.PORT || 5502,
    API_BOT: process.env.API_BOT || "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",
}

export default config;