import React from "react";
import { Card, Form } from "antd";
import { useGetCategoriesQuery } from "../../../redux/features/category/categoryApi";
import ProductForm from "../components/ProductForm";

const CreateProductPage: React.FC = () => {
  const { data: categoriesData } = useGetCategoriesQuery();
  const [form] = Form.useForm();

  const categories = categoriesData?.categories || [];

  return (
    <Card title="Create New Product">
      <ProductForm categories={categories} form={form} />
    </Card>
  );
};

export default CreateProductPage;
