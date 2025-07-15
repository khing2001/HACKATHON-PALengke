import  AsyncStorage  from '@react-native-async-storage/async-storage';

export type ChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
}


export const getMessages = async (storageKey: string): Promise<ChatMessage[]> => {
  try{
    const stored = await AsyncStorage.getItem(storageKey);

    if(stored)
  return JSON.parse(stored);
    return [];
} catch (e){
    console.error('Failed to get message', e);
    return [];
}
}

export const addMessage = async(storageKey: string, chatMessage: ChatMessage) => {
  const messages = await getMessages(storageKey);
  const updatedMessages = [...messages, chatMessage];
  await AsyncStorage.setItem(storageKey, JSON.stringify(updatedMessages));
}




