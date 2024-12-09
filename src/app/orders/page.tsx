"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  getOrders,
  cancelOrder as cancelOrderAPI,
} from "@/api/services/orders/orderApi";
import { Order } from "@/app/orders/type";
import { toast } from "@/hooks/use-toast";
import withAuth from "@/components/common/withAuth";
import Loading from "@/app/loading";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
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
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Package,
  XCircle,
  DollarSign,
  MapPin,
  Calendar,
} from "lucide-react";

interface ErrorType {
  response: {
    data: {
      message: string;
    };
  };
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const OrderTracker = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await getOrders();
        if (response.status === 200) {
          setOrders(response.data.orders);
          toast({
            title: "Success",
            description: response.data.message,
            variant: "default",
          });
        }
      } catch (err: unknown) {
        const error = err as ErrorType;
        toast({
          title: "Error",
          description: error.response.data.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId: string) => {
    try {
      const response = await cancelOrderAPI(orderId);
      if (response.status === 200) {
        toast({
          title: "Success",
          description: response.data.message,
          variant: "default",
        });
        setOrders(
          orders.map((order) =>
            order._id === orderId ? { ...order, status: "cancel" } : order
          )
        );
      }
    } catch (error: unknown) {
      const typedError = error as ErrorType;
      toast({
        title: "Error",
        description: typedError.response.data.message,
        variant: "destructive",
      });
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
    return <Loading />;
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

  const filteredOrders = orders.filter(
    (order) => activeTab === "all" || order.status === activeTab
  );

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-4xl font-bold mb-6 text-center">Theo dõi đơn hàng</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Tổng quan đơn hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
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
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Đơn hàng gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <li
                  key={order._id}
                  className="flex items-center justify-between p-3 bg-white rounded-md transition-all hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(order.status)}
                    <span className="font-medium">#{order._id.slice(-6)}</span>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {order.status}
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 rounded-xl bg-muted p-1">
          {["all", "pending", "processing", "delivered", "cancel"].map(
            (tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="rounded-lg data-[state=active]:bg-background"
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </TabsTrigger>
            )
          )}
        </TabsList>
        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Accordion key={order._id} type="single" collapsible>
                <AccordionItem
                  value={order._id}
                  className="border rounded-lg shadow-md overflow-hidden"
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(order.status)}
                        <span className="font-medium text-sm">
                          Đơn hàng #
                          {order.productVariants.map(
                            (p) => p.productVariant.name
                          )}
                        </span>
                      </div>
                      <Badge variant="outline" className="capitalize text-sm">
                        {order.status}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="px-6 py-4 space-y-6">
                      <Progress
                        value={getStatusProgress(order.status)}
                        className="w-full h-2"
                      />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">Tổng tiền</p>
                            <p className="font-medium">
                              {order.totalAmount.toLocaleString()} VND
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">
                              Địa chỉ nhận hàng
                            </p>
                            <p className="font-medium">
                              {order.shippingAddress}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">Ngày đặt</p>
                            <p className="font-medium">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      <Separator />
                      <div>
                        <h3 className="font-medium text-lg mb-3">Sản phẩm</h3>
                        <ul className="space-y-4">
                          {order.productVariants.map((product) => (
                            <li
                              key={product._id}
                              className="flex items-center space-x-4 bg-gray-50 p-3 rounded-md"
                            >
                              <Image
                                src={product.productVariant.images[0]}
                                alt={product.productVariant.name}
                                width={80}
                                height={80}
                                className="rounded-md object-cover"
                              />
                              <div>
                                <p className="font-medium">
                                  {product.productVariant.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {product.productVariant.color} (
                                  {product.productVariant.storage}GB)
                                </p>
                                <p className="text-sm text-gray-500">
                                  Số lượng: {product.quantity}
                                </p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                      {order.status === "pending" && (
                        <Button
                          onClick={() => handleCancelOrder(order._id)}
                          variant="destructive"
                          className="w-full"
                        >
                          Hủy đơn hàng
                        </Button>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default withAuth(OrderTracker);
