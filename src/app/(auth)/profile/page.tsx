"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { User, Phone, MapPin } from "lucide-react";
import { getProfile, updateProfile } from "@/api/services/auth/authApi";
import type { ProfileType } from "@/app/(auth)/profile/type";
import withAuth from "@/components/common/withAuth";

const UserProfile = () => {
  const [userData, setUserData] = useState<ProfileType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedPhoneNumber, setEditedPhoneNumber] = useState("");
  const [editedAddress, setEditedAddress] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getProfile();
        setUserData(response.data);
        setEditedName(response.data.name);
        setEditedPhoneNumber(response.data.phoneNumber);
        setEditedAddress(response.data.address);
      } catch (error) {
        console.error("Failed to load user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      await updateProfile({
        name: editedName,
        phoneNumber: editedPhoneNumber,
        address: editedAddress,
      });
      setIsEditing(false);
      alert("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  if (!userData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center">
            <User className="mr-2" /> User Profile
          </CardTitle>
          <CardDescription>
            Manage your account details and view your order history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="profile">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="orders">Order History</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                    />
                  ) : (
                    <div className="mt-1">{userData.name}</div>
                  )}
                </div>
                <div>
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  {isEditing ? (
                    <Input
                      id="phoneNumber"
                      value={editedPhoneNumber}
                      onChange={(e) => setEditedPhoneNumber(e.target.value)}
                    />
                  ) : (
                    <div className="mt-1 flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      {userData?.phoneNumber}
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  {isEditing ? (
                    <Input
                      id="address"
                      value={editedAddress}
                      onChange={(e) => setEditedAddress(e.target.value)}
                    />
                  ) : (
                    <div className="mt-1 flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {userData.address}
                    </div>
                  )}
                </div>
                <div>
                  <Label>Role</Label>
                  <div className="mt-1">{userData.role}</div>
                </div>
                <div>
                  <Label>Account Status</Label>
                  <div className="mt-1">
                    <Badge
                      variant={userData.active ? "outline" : "destructive"}
                    >
                      {userData.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="orders">
              <Accordion type="single" collapsible className="w-full">
                {userData.orderHistory.map((order, index) => (
                  <AccordionItem key={order._id} value={`item-${index}`}>
                    <AccordionTrigger>
                      <div className="flex justify-between w-full">
                        <span>Order #{order._id.slice(-6)}</span>
                        <Badge
                          variant={
                            order.status === "pending"
                              ? "default"
                              : order.status === "processing"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {order.status}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <p>
                          <strong>Date:</strong> {formatDate(order.createdAt)}
                        </p>
                        <p>
                          <strong>Total Amount:</strong>{" "}
                          {formatCurrency(order.totalAmount)}
                        </p>
                        <p>
                          <strong>Shipping Address:</strong>{" "}
                          {order.shippingAddress}
                        </p>
                        <p>
                          <strong>Payment Method:</strong> {order.paymentMethod}
                        </p>
                        <div>
                          <strong>Products:</strong>
                          <ul className="list-disc pl-5 mt-2">
                            {order.productVariants &&
                              order.productVariants
                                .filter((item) => item.productVariant !== null)
                                .map((item, itemIndex) => (
                                  <li key={itemIndex}>
                                    {item.productVariant.name} -{" "}
                                    {item.productVariant.color.colorName} (
                                    {item.productVariant.storage}GB) x{" "}
                                    {item.quantity} -{" "}
                                    {formatCurrency(
                                      item.productVariant.price * item.quantity
                                    )}
                                  </li>
                                ))}
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          {isEditing ? (
            <>
              <Button onClick={handleUpdateProfile}>Save Changes</Button>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="ml-2"
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};
export default withAuth(UserProfile);
