"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import withAuth from "@/components/common/withAuth";
import {
  getOrders,
  cancelOrder as cancelOrderAPI,
} from "@/api/services/orders/orderApi";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Package,
  XCircle,
} from "lucide-react";

interface Product {
  productId: string;
  productName: string;
  productColor: string;
  productColorCode: string;
  productStorage: string;
  productPrice: number;
  quantity: number;
  productImages: string[];
}

interface Order {
  orderId: string;
  user: { id: string; name: string };
  products: Product[];
  totalAmount: number;
  status: "pending" | "processing" | "delivered" | "cancel";
  shippingAddress: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

const OrderTracker = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await getOrders();
        setOrders(response.data.orders);
      } catch (err) {
        console.error(err);
        setError("Failed to load orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId: string) => {
    try {
      await cancelOrderAPI(orderId);
      setOrders(
        orders.map((order) =>
          order.orderId === orderId ? { ...order, status: "cancel" } : order
        )
      );
    } catch {
      setError("Failed to cancel order. Please try again later.");
    }
  };

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "processing":
        return <Package className="h-5 w-5 text-blue-500" />;
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "cancel":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusProgress = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return 25;
      case "processing":
        return 50;
      case "delivered":
        return 100;
      case "cancel":
        return 0;
      default:
        return 0;
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4">Loading orders...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }

  if (orders.length === 0) {
    return <div className="container mx-auto p-4">No orders found.</div>;
  }

  const orderStatusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieChartData = Object.entries(orderStatusCounts).map(
    ([status, count]) => ({
      name: status,
      value: count,
    })
  );

  const COLORS = ["#FCD34D", "#60A5FA", "#34D399", "#EF4444"];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Order Tracker</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {Object.entries(orderStatusCounts).map(([status, count]) => (
                <div key={status} className="flex items-center">
                  <Badge variant="outline" className="mr-2">
                    {count}
                  </Badge>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {orders.slice(0, 5).map((order) => (
                <li
                  key={order.orderId}
                  className="flex items-center justify-between"
                >
                  <span>#{order.orderId}</span>
                  <Badge variant="outline">{order.status}</Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
          <TabsTrigger value="cancel">Cancelled</TabsTrigger>
        </TabsList>
        {(["all", "pending", "processing", "delivered", "cancel"] as const).map(
          (tab) => (
            <TabsContent key={tab} value={tab}>
              <Accordion type="single" collapsible className="space-y-4">
                {orders
                  .filter((order) => tab === "all" || order.status === tab)
                  .map((order) => (
                    <AccordionItem key={order.orderId} value={order.orderId}>
                      <AccordionTrigger>
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center space-x-4">
                            {getStatusIcon(order.status)}
                            <span>Order #{order.orderId}</span>
                          </div>
                          <Badge variant="outline">
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <Progress
                            value={getStatusProgress(order.status)}
                            className="w-full"
                          />
                          <p>
                            <strong>Total Amount:</strong>{" "}
                            {order.totalAmount.toLocaleString()} VND
                          </p>
                          <p>
                            <strong>Shipping Address:</strong>{" "}
                            {order.shippingAddress}
                          </p>
                          <p>
                            <strong>Order Date:</strong>{" "}
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                          <div>
                            <strong>Products:</strong>
                            <ul className="list-disc pl-5 mt-2">
                              {order.products.map((product) => (
                                <li key={product.productId} className="mb-2">
                                  <div className="flex items-center space-x-2">
                                    <img
                                      src={product.productImages[0]}
                                      alt={product.productName}
                                      className="w-12 h-12 object-cover rounded"
                                    />
                                    <div>
                                      <p className="font-medium">
                                        {product.productName}
                                      </p>
                                      <p className="text-sm text-gray-500">
                                        {product.productColor} (
                                        {product.productStorage}GB) x{" "}
                                        {product.quantity}
                                      </p>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                          {order.status === "pending" && (
                            <Button
                              onClick={() => handleCancelOrder(order.orderId)}
                              variant="destructive"
                            >
                              Cancel Order
                            </Button>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
              </Accordion>
            </TabsContent>
          )
        )}
      </Tabs>
    </div>
  );
};

export default withAuth(OrderTracker);
