export type OptionValue = {
  label: string;
  price: number;
};
export type Option = {
  label: string;
  type: "select";
  values: {
    [key: string]: OptionValue;
  };
};

export type OptionsConfig = {
  [key: string]: Option;
};

export type CartOption = {};
export type CartItemOption = {
  [key: string]: {
    values: {
      [key: string]: {
        price: number;
      };
    };
  };
};

export interface CartItem {
  id: string;
  name: string;
  img: string;
  options: CartItemOption;
  quantity: number;
  price: number;
}
export type UserCart = {
  [key: string]: CartItem;
};

export type OrderType = {
  productId: string;
  userId: string;
  refId: string;
  productOptions: CartItemOption;
  price: number;
  quantity: number;
  deliveryFee: number;
};

export interface CartRequestType {
  productId: string;
  options: CartItemOption;
}

export interface CheckoutLocation {
  city: string;
  collectionId: string;
  collectionName: string;
  country: string;
  created: string;
  id: string;
  lat: number;
  lng: number;
  state: string;
  street: string;
  updated: string;
  user_id: string;
  zip: string;
}

export interface CheckoutFees {
  deliveryFee: number;
  totalFees: number;
}

export interface CheckoutType {
  delivery_fee: number;
  fees: CheckoutFees;
  location: CheckoutLocation;
  message: string;
  opt: any[];
  sub_total_fees: number;
  total_fees: number;
}
