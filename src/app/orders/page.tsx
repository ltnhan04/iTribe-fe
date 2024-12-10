"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  getOrders,
  cancelOrder as cancelOrderAPI,
} from "@/api/services/orders/orderApi";
import type { Order, ErrorType } from "@/app/orders/type";
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
import { cva } from "class-variance-authority";
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
        }
      } catch (err) {
        toast({
          title: "Đã xảy ra lỗi",
          description: (err as ErrorType).response.data.message,
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
            order._id === orderId ? { ...order, status: "cancelled" } : order
          )
        );
      }
    } catch (error) {
      toast({
        title: "Đã xảy ra lỗi",
        description: (error as ErrorType).response.data.message,
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "processing":
        return <Package className="h-5 w-5 text-blue" />;
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };
  const progressColors = cva("", {
    variants: {
      status: {
        pending: "bg-[#FFBB28]",
        processing: "bg-blue",
        shipped: "bg-[#00C49F]",
        delivered: "bg-[#00C50F]",
        cancelled: "bg-[#FF8042]",
      },
    },
  });

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  const getStatusProgress = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return 25;
      case "processing":
        return 50;
      case "delivered":
        return 100;
      case "cancelled":
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
                  {pieChartData.map((_, index) => (
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
                  className="flex items-center justify-between bg-white rounded-md transition-all hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(order.status)}
                    <span className="font-medium">
                      <div className="text-xs max-w-44 truncate">
                        Đơn hàng #
                        {order.productVariants.map(
                          (p) => p.productVariant.name
                        )}
                      </div>
                    </span>
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
                        <span className="font-medium text-sm max-w-56 truncate">
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
                        className={`w-full h-2 ${progressColors({
                          status: order.status,
                        })}`}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                              Tổng tiền
                            </CardTitle>
                            <DollarSign className="h-4 w-4 text-green-500" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">
                              {order.totalAmount.toLocaleString()} VND
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                              Địa chỉ nhận hàng
                            </CardTitle>
                            <MapPin className="h-4 w-4 text-blue-500" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-sm font-medium truncate">
                              {order.shippingAddress}
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                              Ngày đặt
                            </CardTitle>
                            <Calendar className="h-4 w-4 text-purple-500" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-sm font-medium">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      <Separator />
                      <div>
                        <h3 className="font-medium text-lg mb-3 flex items-center">
                          <Package className="h-5 w-5 mr-2 text-orange-500" />
                          Sản phẩm
                        </h3>
                        <ul className="space-y-4">
                          {order.productVariants.map((product) => (
                            <li
                              key={product._id}
                              className="flex items-center space-x-4 bg-secondary p-4 rounded-lg"
                            >
                              <Image
                                src={product.productVariant.images[0]}
                                alt={product.productVariant.name}
                                width={80}
                                height={80}
                                className="rounded-md object-cover"
                              />
                              <div className="flex-1">
                                <p className="font-medium">
                                  {product.productVariant.name}
                                </p>
                                <div className="flex items-center space-x-2 mt-1">
                                  <Badge variant="outline">
                                    {product.productVariant.color.colorName}
                                  </Badge>
                                  <Badge variant="default">
                                    {product.productVariant.storage}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
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
