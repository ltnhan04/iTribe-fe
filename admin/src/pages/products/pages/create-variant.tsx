import React, { useState, useEffect } from "react";
import { Card, Form } from "antd";
import { useParams } from "react-router-dom";
import type { UploadFile } from "antd/es/upload/interface";
import { useGetProductQuery } from "../../../redux/features/product/productApi";
import VariantForm from "../components/VariantForm";

const CreateVariantPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [colorOptions, setColorOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const { data: productData } = useGetProductQuery(productId || "", {
    skip: !productId,
  });

  useEffect(() => {
    if (productData?.data) {
      const productName = productData.data.name
        .toLowerCase()
        .replace(/\s+/g, "-");
      const storage = form.getFieldValue("storage") || "";
      const newSlug = `${productName}-${storage
        .toLowerCase()
        .replace(/\s+/g, "-")}`;
      form.setFieldsValue({ slug: newSlug });
    }
  }, [form, productData]);

  if (!productId) {
    return <div>Invalid product ID</div>;
  }

  return (
    <Card title="Create New Variant">
      <VariantForm
        form={form}
        fileList={fileList}
        setFileList={setFileList}
        colorOptions={colorOptions}
        setColorOptions={setColorOptions}
        onStorageChange={(value) => {
          const productName =
            productData?.data.name.toLowerCase().replace(/\s+/g, "-") || "";
          const newSlug = `${productName}-${value
            .toLowerCase()
            .replace(/\s+/g, "-")}`;
          form.setFieldsValue({ slug: newSlug });
        }}
      />
    </Card>
  );
};

export default CreateVariantPage;
