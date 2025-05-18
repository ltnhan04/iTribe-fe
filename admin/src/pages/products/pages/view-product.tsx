import React from "react";
import { Card } from "antd";
import { useParams } from "react-router-dom";
import { useGetProductQuery } from "../../../redux/features/product/productApi";
import ProductDetails from "../components/ProductDetails";
import Loading from "../../../loading";

const ViewProductPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { data: productData, isLoading } = useGetProductQuery(productId || "");

  if (!productId) {
    return <div>Invalid product ID</div>;
  }

  if (isLoading) {
    return <Loading />;
  }

  if (!productData?.data) {
    return <div>Product not found</div>;
  }

  return (
    <Card title="Product Details">
      <ProductDetails product={productData.data} />
    </Card>
  );
};

export default ViewProductPage;
