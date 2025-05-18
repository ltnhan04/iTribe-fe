/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Form, Input, InputNumber, Button, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useCreateProductVariantMutation } from "../../../redux/features/variant/productVariantApi";
import type { FormInstance } from "antd/es/form";
import type { UploadFile } from "antd/es/upload/interface";
import Loading from "../../../loading";

interface VariantFormProps {
  form: FormInstance;
  fileList: UploadFile[];
  setFileList: (files: UploadFile[]) => void;
  colorOptions: { label: string; value: string }[];
  setColorOptions: (options: { label: string; value: string }[]) => void;
  onStorageChange: (value: string) => void;
}

const VariantForm: React.FC<VariantFormProps> = ({
  form,
  fileList,
  setFileList,
  onStorageChange,
}) => {
  const navigate = useNavigate();
  const [createVariant, { isLoading }] = useCreateProductVariantMutation();
  const { productId } = useParams();

  const onFinish = async (values: any) => {
    try {
      const formData = new FormData();
      formData.append("product", productId as string);
      formData.append("colorName", values.color.colorName);
      formData.append("colorCode", values.color.colorCode);
      formData.append("storage", values.storage);
      formData.append("price", values.price.toString());
      formData.append("stock_quantity", values.stock_quantity.toString());
      formData.append("slug", values.slug);

      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append("images", file.originFileObj);
        }
      });

      await createVariant(formData).unwrap();
      message.success("Variant created successfully");
      navigate("/products");
    } catch (error) {
      message.error("Failed to save variant");
    }
  };
  if (isLoading) {
    return <Loading />;
  }

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        name="storage"
        label="Storage"
        rules={[{ required: true, message: "Please input storage!" }]}
      >
        <Input
          placeholder="e.g. 128GB"
          onChange={(e) => onStorageChange(e.target.value)}
        />
      </Form.Item>

      <Form.Item
        name={["color", "colorName"]}
        label="Color Name"
        rules={[{ required: true, message: "Please input color name!" }]}
      >
        <Input placeholder="e.g. Space Gray" />
      </Form.Item>

      <Form.Item
        name={["color", "colorCode"]}
        label="Color Code"
        rules={[{ required: true, message: "Please input color code!" }]}
      >
        <Input type="color" />
      </Form.Item>

      <Form.Item
        name="price"
        label="Price"
        rules={[{ required: true, message: "Please input price!" }]}
      >
        <InputNumber style={{ width: "100%" }} min={0} />
      </Form.Item>

      <Form.Item
        name="stock_quantity"
        label="Stock Quantity"
        rules={[{ required: true, message: "Please input stock quantity!" }]}
      >
        <InputNumber style={{ width: "100%" }} min={0} />
      </Form.Item>

      <Form.Item name="slug">
        <Input disabled />
      </Form.Item>

      <Form.Item
        name="images"
        label="Images"
        rules={[
          { required: true, message: "Please upload at least one image!" },
        ]}
      >
        <Upload
          listType="picture-card"
          accept="image/png, image/jpeg, image/jpg"
          maxCount={5}
          beforeUpload={() => false}
          multiple
          fileList={fileList}
          onChange={({ fileList }) => setFileList(fileList)}
        >
          <div>
            <UploadOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        </Upload>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Create Variant
        </Button>
        <Button style={{ marginLeft: 8 }} onClick={() => navigate("/products")}>
          Cancel
        </Button>
      </Form.Item>
    </Form>
  );
};

export default VariantForm;
