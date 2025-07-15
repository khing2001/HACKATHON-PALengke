import * as Location from 'expo-location'
import { GOOGLE_PLACE_API_KEY } from '@env';
import axios from 'axios';

export const getLocation = async () => {
  let {status} = await Location.requestForegroundPermissionsAsync();
  if(status !== 'granted'){
    console.log('Permission Denied');
    return;
  }

  let location = await Location.getCurrentPositionAsync({});

  return location.coords;

}

export const fetchNearbyBusiness = async(lat: number, lng: number) => {
  const url = `https://maps.googleapis.com/maps/places`
}

