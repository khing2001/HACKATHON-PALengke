import axios from 'axios';
import { OPENAI_API_KEY } from '@env';
import { ChatMessage } from '../aiStorage';

export interface OpenAIPayload{
  messages: ChatMessage[],
  model: string
}


export const OpenAI  = async({messages, model}: OpenAIPayload) => {
  try{
    const res = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model,
        messages,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return res.data.choices[0].message.content.trim();
  } catch(error : any){
   console.error('OpenAI API error:', error?.response?.data || error.message);
    return 'Something went wrong.';}
}
