import express, { Request, Response } from 'express';
import OpenAI from 'openai';

import config from '../config';

const router = express.Router();

const openai = new OpenAI({ apiKey: config.API_BOT });

router.post('/chatWithBot', async (req: Request, res: Response) => {
  const { text } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: "You are a helpful assistant." }, { role: "user", content: text }],
      model: "gpt-3.5-turbo",
    });

    const botResponse = completion.choices[0].message.content;
    console.log(botResponse);
    res.status(200).json({ success: true, message: 'Mensaje recibido', data: { userMessage: text, botMessage: botResponse } });
  } catch (error: any) {
    if (error.response) {
      const statusCode = error.response.status;

      if (statusCode === 401) {
        // Handle 401 Unauthorized errors
        console.log('Error 401: Unauthorized');
        res.status(401).json({ success: false, message: 'Unauthorized', data: null });
      } else if (statusCode === 429) {
        // Handle 429 Rate Limit errors
        console.log('Error 429: Rate Limit Exceeded. Please wait before trying again.');
        res.status(429).json({ success: false, message: 'Rate Limit Exceeded', data: null });
      } else if (statusCode === 500) {
        // Handle 500 Internal Server errors
        console.log('Error 500: Internal Server Error. Please retry after a brief wait.');
        res.status(500).json({ success: false, message: 'Internal Server Error', data: null });
      } else if (statusCode === 503) {
        // Handle 503 Service Unavailable errors
        console.log('Error 503: Service Unavailable. Please try again later.');
        res.status(503).json({ success: false, message: 'Service Unavailable', data: null });
      } else {
        // Handle other errors
        console.error(`Error en el servidor: ${statusCode}`, error);
        res.status(statusCode).json({ success: false, message: 'Error en el servidor', data: null });
      }
    } else {
      // Handle other errors without response property
      console.error('Error en el servidor:', error);
      res.status(500).json({ success: false, message: 'Error en el servidor', data: null });
    }
  }
});

export default router;