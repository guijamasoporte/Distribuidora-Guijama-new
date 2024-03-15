export interface Client {
  _id: any;
  idClient: string;
  name: string;
  lastName: string;
  phone: string;
  email: string;
  adress: string;
  buys: Sales[];
}

export interface Product {
  _id: string;
  unity: string | number | readonly string[] | undefined | any;
  generic: boolean;
  code: string;
  title: string;
  stock: number;
  priceList: number | null | any;
  priceCost: number | null | any;
  category: string;
  brand: string;
  image: [];
  variant: string;
}

export interface ProductsProps {
  data: Product[];
}

export interface Sales {
  _id: string;
  saleId: string;
  idSale: string;
  date: string;
  products: Product[];
  priceTotal: number;
  client:Client;
  dues: Dues;
  state: boolean;
}

export interface Dues {
  length: number;
  payd: [];
  cant: number;
}

export interface DataLogin {
  email: string;
  password: string;
}

export interface propsModals {
  open: boolean;
  onClose: () => void;
  onCreate: (newClient: Client) => void;
  handleClose: () => void;
  categories: string[];
  brands: string[];
  variant: string[];
}
