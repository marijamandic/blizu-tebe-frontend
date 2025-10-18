export interface LocalCommunity {
  id?: number;
  name: string;
  city: string;
  boundary: string; 
  centerPoint?: [number, number]; // [lng, lat]
  presidentId?: number;
  phoneNumber?: string;
  facebook?: string;
}