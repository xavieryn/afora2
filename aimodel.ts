import OpenAI from 'openai';
// const data = require('./aiconfig.json');

// const apiKey = data.OPENAI_API_KEY;
const apiKey = process.env.OPENAI_API_KEY;

const client = new OpenAI({
    apiKey: apiKey, // This is the default and can be omitted
});

export { client, apiKey };