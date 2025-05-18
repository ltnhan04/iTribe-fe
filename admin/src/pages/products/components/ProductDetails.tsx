import React from "react";
import { Descriptions, Button, Space, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import { IProduct, Variant } from "../../../types/product";
import VariantTable from "./VariantTable";

interface ProductDetailsProps {
  product: IProduct;
  onViewVariantDetails?: (variant: Variant) => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  onViewVariantDetails,
}) => {
  const navigate = useNavigate();
  return (
    <div>
      <Descriptions
        title="Product Information"
        bordered
        column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }}
      >
        <Descriptions.Item label="Name" span={2}>
          <span style={{ fontWeight: "bold" }}>{product.name}</span>
        </Descriptions.Item>
        <Descriptions.Item label="Description" span={2}>
          <div dangerouslySetInnerHTML={{ __html: product.description }} />
        </Descriptions.Item>
        <Descriptions.Item label="Category">
          <Tag color="blue">{product.category?.name || "No category"}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Created At">
          {new Date(product.createdAt || "").toLocaleDateString()}
        </Descriptions.Item>
      </Descriptions>

      <div style={{ marginTop: 24 }}>
        <Space style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            onClick={() => navigate(`/products/${product._id}/variants/create`)}
          >
            Add Variant
          </Button>
        </Space>

        <h3>Variants</h3>
        <VariantTable
          variants={product.variants || []}
          onViewDetails={onViewVariantDetails}
        />
      </div>
    </div>
  );
};

export default ProductDetails;
