import { OpenAI, OpenAIPayload } from './openAI'
import { Product } from '../inventory';
import { addMessage, getMessages } from '../aiStorage';

const STORAGE_KEY = 'restockAI_Message_History';

const initialMessage =
        `You are a smart inventory and sales assistant designed to help small business owners make informed restocking decisions. Your role is to analyze current stock levels, sales trends, reorder thresholds, and lead times for each product. Based on the data provided, offer clear and actionable restocking recommendations, including:

-Identify which products need to be restocked soon by analyzing sales timestamps and quantities sold to determine demand trends and depletion rates.
-Recommend how many units to reorder for each product, based on sales volume, sales frequency, and how often inventory is typically replenished.
- If restocking is not needed, explain why (e.g., slow sales, high current stock)
- Optional notes on sales trends or demand patterns

Be concise, helpful, and use bullet points per product. Avoid generic responses and base your advice strictly on the provided data.
`



type inputArg = {
  products: Product;
  forecastDays: number;

}

export async function handleRestockCheck(props: inputArg){

  await addMessage(STORAGE_KEY, {role: 'system', content: initialMessage});


  const prompt =
    `You are an intelligent assistant that helps small business owners decide when to restock inventory based on current stock levels, recent sales, and product turnover rates.

      Here is the data for each product:

        ${props.products}

        Forecast period: ${props.forecastDays}
        Based on this data, suggest:
        1. Which products need to be restocked soon
        2. How many units to reorder
        3. Notes if no restock is needed.

        Return the output as a bullet-point summary per product.
`


  await addMessage(STORAGE_KEY, {role: 'user', content: prompt});

  const messages = await getMessages(STORAGE_KEY);

  const res = await OpenAI({
    model: 'gpt-4o',
    messages,
  });

  await addMessage(STORAGE_KEY, {role: 'assistant', content: res});

  return res;
}
