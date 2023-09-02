import 'express-async-errors';
import cors from 'cors';
import express, {NextFunction, Request, Response, json} from 'express'
import {AuthenticationError, OpenAI} from 'openai'


const app = express();

app.use(cors());
app.use(json());

app.post("/translate", async (request:Request, response: Response) => {
  const {text, apiKey: key, org} = request.body; 

  const api = new OpenAI({
    apiKey: key,
    organization:org
  }) 

  const content = await api.chat.completions.create({
    messages:[
      {role:"system",content:"You will receive a text in English and your task is to translate it into Brazilian Portuguese. Be consistent and understand the context. Do not translate proper names or nouns. Try not to be redundant. "},
      {role:"user", content: text}],
    model:'gpt-3.5-turbo'
  })

  return response.json({message: content.choices[0].message.content});
})

app.use((err: Error, request: Request, response: Response, next: NextFunction) => {
  if(err instanceof AuthenticationError) return response.status(401).json({msg: err.message})
  return response.status(500).json({msg: err.message})
})

app.listen(3333, () => {
    console.log('Rodando')
})