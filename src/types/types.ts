export type MenuType = {
  id: string;
  slug: string;
  title: string;
  desc?: string;
  img?: string;
  color: string;
}[];

export type ProductType = {
  id: string;
  title: string;
  desc?: string;
  img?: string;
  price: number;
  catSlug: string; //ive added could be delete
  options?: { title: string; additionalPrice: number }[];
};

export type OrderType = {
  id: string;
  userEmail: string;
  price: number;
  products: CartItemType[];
  status: string;
  createdAt: Date;
  intent_id?: String;
  method: string;
};

export type CartItemType = {
  id: string;
  title: string;
  img?: string;
  price: number;
  optionTitle?: string;
  quantity: number;
  cookingPreference?: string;
  instructions?: string;
};

export type CartType = {
  products: CartItemType[];
  totalItems: number;
  totalPrice: number;
  //newQuantity:number;
};

// export type paymentMethod = {
//   card: string;
//   cash: string;
// };

export type ActionTypes = {
  addToCart: (item: CartItemType) => void;
  removeFromCart: (item: CartItemType) => void;
  //updateQuantity: (item: CartItemType) => void;
  updateQuantity: (itemId: string, newQuantity: number) => void;
};
