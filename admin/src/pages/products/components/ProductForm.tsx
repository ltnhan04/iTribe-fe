/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { Form, Input, Select, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from "../../../redux/features/product/productApi";
import { INewProduct } from "../../../types/product";
import type { FormInstance } from "antd/es/form";
import { Category } from "../../../types/category";

interface ProductFormProps {
  form: FormInstance;
  categories: Category[];
  productId?: string;
  initialValues?: FormValues;
  onSuccess?: () => void;
}

interface FormValues {
  name: string;
  category: string;
  description: string;
}

const ProductForm: React.FC<ProductFormProps> = ({
  form,
  categories,
  productId,
  initialValues,
  onSuccess,
}) => {
  const navigate = useNavigate();
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  const onFinish = async (values: FormValues) => {
    try {
      const selectedCategory = categories.find(
        (cat) => cat._id === values.category
      );
      if (!selectedCategory) {
        message.error("Invalid category selected");
        return;
      }

      const productData: INewProduct = {
        name: values.name,
        description: values.description,
        category: {
          _id: selectedCategory._id || "",
          name: selectedCategory.name,
        },
      };

      if (productId) {
        await updateProduct({ id: productId, product: productData }).unwrap();
        message.success("Product updated successfully");
        onSuccess?.();
      } else {
        await createProduct(productData).unwrap();
        message.success("Product created successfully");
        navigate("/products");
      }
    } catch (error) {
      message.error("Failed to save product");
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={onFinish}
    >
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: "Please input product name!" }]}
      >
        <Input placeholder="Enter product name" />
      </Form.Item>

      <Form.Item
        name="category"
        label="Category"
        rules={[{ required: true, message: "Please select category!" }]}
      >
        <Select placeholder="Select category">
          {categories.map((category) => (
            <Select.Option key={category._id} value={category._id}>
              {category.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true, message: "Please input description!" }]}
      >
        <CKEditor
          editor={ClassicEditor}
          data={form.getFieldValue("description") || ""}
          onChange={(_event, editor) => {
            const data = editor.getData();
            form.setFieldsValue({ description: data });
          }}
          config={{
            toolbar: [
              "heading",
              "|",
              "bold",
              "italic",
              "link",
              "bulletedList",
              "numberedList",
              "|",
              "outdent",
              "indent",
              "|",
              "blockQuote",
              "insertTable",
              "undo",
              "redo",
            ],
          }}
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          {productId ? "Update" : "Create"} Product
        </Button>
        <Button style={{ marginLeft: 8 }} onClick={() => navigate("/products")}>
          Cancel
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ProductForm;
