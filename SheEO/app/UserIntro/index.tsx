
import { router } from 'expo-router';
import { useEffect } from 'react';

export default function FirstIndex() {
  useEffect(() => {
    router.replace('/(first)/language');
  }, []);

  return null;
}

