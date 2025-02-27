export interface Property {
  _id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  listedIn: string; // Ensure this is defined
  price: number;
  size: string; // Ensure this is defined
  bedrooms: number;
  bathrooms: number;
  kitchens: number;
  yearBuilt: string;
  floors: number;
  amenities: string[];
  address: string;
  ownerContactNumber: string;
  location: {
    city: string;
  };
  images: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}