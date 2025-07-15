import { addMessage, getMessages, ChatMessage } from '../aiStorage';
import { OpenAI, OpenAIPayload } from './openAI';
import { addProducts, Product } from '../inventory';
import { getProducts } from '../inventory';

export type StoreInfo = {
  storeName: string,
  location: string,
}

const STORAGE_KEY = 'share_Store_AI';


export const ShareStoreAI = async (storeInfo: StoreInfo) => {
  const products: Product[]= await getProducts();
  const productNames = products.map( product => product.name);
  const productLogs = products.map(product => product.logs);
  const initialChatMessage: ChatMessage =  {
    role: 'system',
    content: `
    You are a helpful assistant that writes short, friendly store promotion messages based on local vendors' inventory data. Given a list of products, their prices, quantity, and restock timestamps, your job is to generate a promotional message in this format:

🛒 Visit [Store Name or “this local store”]!

Briefly describe the products offered using categories like vegetables, fruits, daily essentials, etc., and show a price range per category.

Use emojis and a warm, inviting tone. Then include:

📍 Located at: [location]
⏰ Open: [opening hours from timestamps or "daily"]

End with a short line encouraging customers to visit.

Only include categories for which products exist. Group prices using sellPrice. Keep it short and readable.

Now generate the promo message.
`
  }


  if(products.length === 0)
    return 'Please provide some products for your business first';

  await addMessage(STORAGE_KEY, initialChatMessage);

  const promptChatMessage: ChatMessage = {
    role: 'user',
    content:`You are a helpful assistant that writes short, friendly store promotion messages based on local vendors' inventory data. Given a list of products, their prices, quantity, and restock timestamps, your job is to generate a promotional message in this format:

🛒 Visit ${storeInfo.storeName}!

Briefly describe the products offered using categories like vegetables, fruits, daily essentials, etc., and show a price range per category.
Base the product from this list of products:
${productNames}

Use emojis and a warm, inviting tone. Then include:

📍 Located at: ${storeInfo.location}
⏰ Open: ${productLogs || 'daily'} (make a time range based on first and last time of each timestamp of the day)

End with a short line encouraging customers to visit.

Only include categories for which products exist. Group prices using sellPrice. Keep it short and readable.

Now generate the promo message.`
  }

  await addMessage(STORAGE_KEY, promptChatMessage);

  const messages = await getMessages(STORAGE_KEY);


  const res = await OpenAI({
    model: 'gpt-4.1',
    messages,
  })

  return res;
};

