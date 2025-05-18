/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  message,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useEditCategoryMutation,
  useDeleteCategoryMutation,
} from "../../redux/features/category/categoryApi";
import { Category } from "../../types/category";

const CategoryPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data, isLoading } = useGetCategoriesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useEditCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const columns = [
    {
      title: "ID",
      dataIndex: "index",
      key: "index",
      render: (_: any, __: Category, index: number) => index + 1,
    },
    {
      title: "Category Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => text,
    },
    {
      title: "Parent Category",
      dataIndex: "parent_category",
      key: "parent_category",
      render: (parent: { name: string; _id: string }) => {
        if (!parent) return "null";
        const parentCategory = data?.categories.find(
          (cat) => cat._id === parent._id
        );
        return parentCategory ? parentCategory.name : "null";
      },
    },
    {
      title: "Actions",
      key: "action",
      render: (_: any, record: Category) => (
        <Space size="middle">
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

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: Category) => {
    setEditingId(record._id as string);
    form.setFieldsValue({
      name: record.name,
      parent_category: record.parent_category?._id || null,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id?: string) => {
    if (!id) {
      message.error("Invalid category ID");
      return;
    }

    Modal.confirm({
      title: "Confirm Delete",
      content: "Are you sure you want to delete this category?",
      onOk: async () => {
        try {
          await deleteCategory({ id }).unwrap();
          message.success("Category deleted successfully");
        } catch (error) {
          message.error("Failed to delete category");
        }
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const payload: Category = {
        name: values.name,
        parent_category: values.parent_category || null,
      };

      if (editingId) {
        await updateCategory({
          id: editingId,
          updateCategory: payload,
        }).unwrap();
        message.success("Category updated successfully");
      } else {
        await createCategory(payload).unwrap();
        message.success("Category created successfully");
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (error: any) {
      message.error("Failed to save category");
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button icon={<PlusCircleOutlined />} onClick={handleAdd}>
          Add New Category
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data?.categories}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
        loading={isLoading}
      />

      <Modal
        title={editingId ? "Edit Category" : "Add New Category"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Category Name"
            rules={[{ required: true, message: "Please input category name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="parent_category" label="Parent Category">
            <Select
              allowClear
              placeholder="Select parent category (optional)"
              options={data?.categories.map((cat) => ({
                value: cat._id,
                label: cat.name,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryPage;
