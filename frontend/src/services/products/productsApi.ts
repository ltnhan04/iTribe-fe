import axios from "axios";

export const getProductsByCategory = async (categoryId: string) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/products/filter?categoryId=${categoryId}`
  );
  return res.data;
};

export const getProducts = async () => {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/products/`
  );
};

export const getProductBySlug = async (slug: string) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/products/`,
    {
      slug,
    }
  );
  return res.data;
};
