import axios from "axios";

export const getProducts = async () => {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/products/`
  );
};

export const getProductDetails = async (id: string) => {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/products/${id}`
  );
};

export const getProductByName = async (name: string) => {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/products/name/${name}`
  );
};
