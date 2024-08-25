import axios from "axios";
import { useQuery } from "react-query";
import { Url } from "next/dist/shared/lib/router/router";

const API = `https://fakestoreapi.com/products`;

const fetchProducts = async () => {
  const { data } = await axios.get(API);
  return data; 
};

export default function Products() {
  const { data, isLoading, isError } = useQuery("products", fetchProducts);
  return { data, isLoading, isError };
}

export interface ProdutosData {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: Url;
  rating: {
    rate: number,
    count: number
  }
}

export interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  rating: {
      rate: number;
      count: number;
  };
  quantidade?: number;
  description?: string;
  category?: string;
}
