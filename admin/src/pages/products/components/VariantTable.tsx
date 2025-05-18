/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Table,
  Button,
  Space,
  message,
  Modal,
  Drawer,
  Form,
  Input,
  InputNumber,
  Upload,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import {
  useDeleteProductVariantMutation,
  useUpdateProductVariantMutation,
  useGetDetailsVariantQuery,
} from "../../../redux/features/variant/productVariantApi";
import { Variant } from "../../../types/product";
import { formatCurrency } from "../../../utils/format-currency";
import VariantDetails from "./VariantDetails";
import Loading from "../../../loading";

interface VariantTableProps {
  variants: Variant[];
  onViewDetails?: (variant: Variant) => void;
}

const VariantTable: React.FC<VariantTableProps> = ({ variants }) => {
  const [deleteVariant] = useDeleteProductVariantMutation();
  const [updateVariant] = useUpdateProductVariantMutation();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDetailsDrawerVisible, setIsDetailsDrawerVisible] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null
  );
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

  const { data: variantDetail, isLoading } = useGetDetailsVariantQuery(
    { id: selectedVariantId || "" },
    {
      skip: !selectedVariantId,
    }
  );
  if (isLoading) {
    return <Loading />;
  }

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: "Confirm Delete",
      content: "Are you sure you want to delete this variant?",
      onOk: async () => {
        try {
          await deleteVariant({ id }).unwrap();
          message.success("Variant deleted successfully");
        } catch (error) {
          message.error("Failed to delete variant");
        }
      },
    });
  };

  const handleEdit = (variant: Variant) => {
    setSelectedVariant(variant);
    const initialFileList: UploadFile[] = variant.images.map((url, index) => ({
      uid: `-${index}`,
      name: `image-${index}.jpg`,
      status: "done",
      url: url,
    }));
    setFileList(initialFileList);

    form.setFieldsValue({
      storage: variant.storage,
      color: {
        colorName: variant.color.colorName,
        colorCode: variant.color.colorCode,
      },
      price: variant.price,
      stock_quantity: variant.stock_quantity,
      slug: variant.slug,
    });
    setIsEditModalVisible(true);
  };

  const handleViewDetails = (variant: Variant) => {
    setSelectedVariantId(variant._id);
    setIsDetailsDrawerVisible(true);
  };

  const handleUpdateVariant = async (values: any) => {
    try {
      if (!selectedVariant) return;

      const formData = new FormData();
      formData.append("product", selectedVariant.product);
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

      await updateVariant({
        variantId: selectedVariant._id,
        updatedVariant: formData,
      }).unwrap();
      message.success("Variant updated successfully");
      setIsEditModalVisible(false);
      form.resetFields();
      setFileList([]);
    } catch (error) {
      message.error("Failed to update variant");
    }
  };

  const columns = [
    {
      title: "Storage",
      dataIndex: "storage",
      key: "storage",
      sorter: (a: Variant, b: Variant) => a.storage.localeCompare(b.storage),
    },
    {
      title: "Color",
      key: "color",
      render: (record: Variant) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 20,
              height: 20,
              backgroundColor: record.color.colorCode,
              borderRadius: "50%",
            }}
          />
          <span>{record.color.colorName}</span>
        </div>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) => formatCurrency(price),
      sorter: (a: Variant, b: Variant) => a.price - b.price,
    },
    {
      title: "Stock",
      dataIndex: "stock_quantity",
      key: "stock_quantity",
      sorter: (a: Variant, b: Variant) => a.stock_quantity - b.stock_quantity,
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (rating: number) => rating.toFixed(1),
      sorter: (a: Variant, b: Variant) => a.rating - b.rating,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Variant) => (
        <Space size="middle">
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
          >
            View
          </Button>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={variants}
        rowKey="_id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} items`,
        }}
      />

      <Modal
        title="Edit Variant"
        open={isEditModalVisible}
        onOk={() => {
          form.submit();
          handleUpdateVariant(form.getFieldsValue());
        }}
        onCancel={() => {
          setIsEditModalVisible(false);
          form.resetFields();
          setFileList([]);
        }}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleUpdateVariant}>
          <Form.Item
            name={["color", "colorName"]}
            label="Color Name"
            rules={[{ required: true, message: "Please input color name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name={["color", "colorCode"]}
            label="Color Code"
            rules={[{ required: true, message: "Please input color code!" }]}
          >
            <Input type="color" />
          </Form.Item>

          <Form.Item
            name="storage"
            label="Storage"
            rules={[{ required: true, message: "Please input storage!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Please input price!" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>

          <Form.Item
            name="stock_quantity"
            label="Stock Quantity"
            rules={[
              { required: true, message: "Please input stock quantity!" },
            ]}
          >
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>

          <Form.Item
            name="slug"
            label="Slug"
            rules={[{ required: true, message: "Please input slug!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Images">
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={({ fileList: newFileList }) => setFileList(newFileList)}
              beforeUpload={() => false}
              multiple
            >
              {fileList.length < 5 && (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      <Drawer
        title="Variant Details"
        placement="right"
        onClose={() => {
          setIsDetailsDrawerVisible(false);
          setSelectedVariantId(null);
        }}
        open={isDetailsDrawerVisible}
        width={800}
      >
        {variantDetail?.data && (
          <VariantDetails
            variant={variantDetail.data}
            reviews={[]}
            users={[]}
          />
        )}
      </Drawer>
    </>
  );
};

export default VariantTable;
