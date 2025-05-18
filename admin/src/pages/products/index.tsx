/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { Button, Modal, Form, message, Drawer } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import { useNavigate } from "react-router-dom";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
  useGetProductQuery,
} from "../../redux/features/product/productApi";
import { useGetCategoriesQuery } from "../../redux/features/category/categoryApi";
import ProductTable from "./components/ProductTable";
import ProductForm from "./components/ProductForm";
import ProductFilters from "./components/ProductFilters";
import ProductDetails from "./components/ProductDetails";
import VariantForm from "./components/VariantForm";
import VariantDetails from "./components/VariantDetails";
import { IProduct, Variant } from "../../types/product";
import { Review, User } from "../../types/product";

const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<{
    search?: string;
    category?: string;
  }>({});

  const { data: productsData, isLoading } = useGetProductsQuery();
  const { data: categoriesData } = useGetCategoriesQuery();
  const [deleteProduct] = useDeleteProductMutation();

  const categories = categoriesData?.categories || [];

  const filteredProducts = productsData?.data.filter((product: IProduct) => {
    if (
      filters.search &&
      !product.name.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false;
    }
    if (filters.category && product.category?.name !== filters.category) {
      return false;
    }
    return true;
  });

  const handleFilter = (values: { search?: string; category?: string }) => {
    setFilters(values);
  };

  const handleReset = () => {
    setFilters({});
  };

  const handleDeleteProduct = async (id: string) => {
    Modal.confirm({
      title: "Confirm Delete",
      content: "Are you sure you want to delete this product?",
      onOk: async () => {
        try {
          await deleteProduct(id).unwrap();
          message.success("Product deleted successfully");
        } catch (error) {
          message.error("Failed to delete product");
        }
      },
    });
  };

  const [isProductModalVisible, setIsProductModalVisible] = useState(false);
  const [isVariantModalVisible, setIsVariantModalVisible] = useState(false);
  const [isDetailsDrawerVisible, setIsDetailsDrawerVisible] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [productForm] = Form.useForm();
  const [variantForm] = Form.useForm();
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [colorOptions, setColorOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [isVariantDetailsDrawerVisible, setIsVariantDetailsDrawerVisible] =
    useState(false);
  const [reviews] = useState<Review[]>([]);
  const [users] = useState<User[]>([]);

  const { data: productDetail } = useGetProductQuery(selectedProductId || "", {
    skip: !selectedProductId,
    refetchOnMountOrArgChange: true,
  });

  const handleEditProduct = (record: IProduct) => {
    setEditingId(record._id);
    productForm.setFieldsValue({
      ...record,
      category: record.category?._id,
    });
    setIsProductModalVisible(true);
  };

  const handleStorageChange = (value: string) => {
    if (!selectedProductId) return;
    const slug = `${productDetail?.data.name
      .toLowerCase()
      .replace(/\s+/g, "-")}-${value.toLowerCase()}`;
    variantForm.setFieldsValue({ slug });
  };

  const handleViewProductDetails = (product: IProduct) => {
    setSelectedProductId(product._id);
    setIsDetailsDrawerVisible(true);
  };

  const handleViewVariantDetails = (variant: Variant) => {
    setSelectedVariant(variant);
    setIsVariantDetailsDrawerVisible(true);
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/products/create")}
        >
          Add New Product
        </Button>
      </div>

      <ProductFilters
        onFilter={handleFilter}
        onReset={handleReset}
        categories={categories}
      />

      <ProductTable
        products={filteredProducts || []}
        loading={isLoading}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
        onViewDetails={handleViewProductDetails}
      />

      <Drawer
        title={`Product Details: ${productDetail?.data.name}`}
        placement="right"
        onClose={() => {
          setIsDetailsDrawerVisible(false);
          setSelectedProductId(null);
        }}
        open={isDetailsDrawerVisible}
        width={1000}
      >
        {productDetail?.data && (
          <ProductDetails
            product={productDetail.data}
            onViewVariantDetails={handleViewVariantDetails}
          />
        )}
      </Drawer>

      <Drawer
        title={`Variant Details: ${selectedVariant?.storage}`}
        placement="right"
        onClose={() => setIsVariantDetailsDrawerVisible(false)}
        open={isVariantDetailsDrawerVisible}
        width={800}
      >
        {selectedVariant && (
          <VariantDetails
            variant={{
              ...selectedVariant,
              product: selectedVariant.product,
              status: "in_stock",
            }}
            reviews={reviews}
            users={users}
          />
        )}
      </Drawer>

      <Modal
        title={editingId ? "Edit Product" : "Add Product"}
        open={isProductModalVisible}
        onOk={() => productForm.submit()}
        onCancel={() => {
          setIsProductModalVisible(false);
          productForm.resetFields();
        }}
        width={800}
        footer={null}
      >
        <ProductForm
          form={productForm}
          categories={categories}
          productId={editingId}
          onSuccess={() => {
            setIsProductModalVisible(false);
            productForm.resetFields();
          }}
        />
      </Modal>

      <Modal
        title={editingId ? "Edit Variant" : "Add Variant"}
        open={isVariantModalVisible}
        onOk={() => {
          variantForm.validateFields().then((_values) => {
            setIsVariantModalVisible(false);
            variantForm.resetFields();
            setFileList([]);
            setColorOptions([]);
          });
        }}
        onCancel={() => {
          setIsVariantModalVisible(false);
          variantForm.resetFields();
          setFileList([]);
          setColorOptions([]);
        }}
        width={800}
      >
        <VariantForm
          form={variantForm}
          fileList={fileList}
          setFileList={setFileList}
          colorOptions={colorOptions}
          setColorOptions={setColorOptions}
          onStorageChange={handleStorageChange}
        />
      </Modal>
    </div>
  );
};

export default ProductsPage;
