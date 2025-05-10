import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useReview } from "@/hooks/useReview";
import { Star } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  variantId: string;
  productName: string;
}

const ReviewModal = ({
  isOpen,
  onClose,
  variantId,
  productName,
}: ReviewModalProps) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const { createReview, isCreating } = useReview();
  const { toast } = useToast();

  const handleSubmit = () => {
    createReview(
      {
        variant: variantId,
        rating,
        comment,
      },
      {
        onSuccess: () => {
          toast({
            title: "Thành công",
            description: "Đánh giá sản phẩm thành công!",
          });
          onClose();
        },
        onError: (error: Error) => {
          const axiosError = error as AxiosError<{ message: string }>;
          toast({
            variant: "destructive",
            title: "Lỗi",
            description: axiosError.response?.data?.message || "Có lỗi xảy ra khi đánh giá sản phẩm. Vui lòng thử lại sau.",
          });
        },
      }
    );
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Đánh giá sản phẩm: {productName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Đánh giá:</p>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="comment" className="text-sm font-medium">
                Nhận xét:
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full h-24 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="Hãy chia sẻ cảm nhận của bạn về sản phẩm..."
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button onClick={handleSubmit} disabled={isCreating}>
              {isCreating ? "Đang gửi..." : "Gửi đánh giá"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Toaster />
    </>
  );
};

export default ReviewModal;
