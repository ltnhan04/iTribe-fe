/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { useReview } from "@/hooks/useReview";
import { Review, User } from "@/types/slug";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Star, Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface ProductReviewsProps {
  reviews: Review[];
  currentUser: User | null;
}

const ProductReviews = ({ reviews, currentUser }: ProductReviewsProps) => {
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editComment, setEditComment] = useState("");
  const [editRating, setEditRating] = useState(5);
  const { updateReview, deleteReview, isUpdating, isDeleting } = useReview();
  const { toast } = useToast();

  const handleEdit = (review: Review) => {
    setEditingReview(review);
    setEditComment(review.comment);
    setEditRating(review.rating);
  };

  const handleDelete = (reviewId: string) => {
    deleteReview(reviewId, {
      onSuccess: () => {
        toast({
          title: "Thành công",
          description: "Đã xóa đánh giá thành công!",
        });
      },
      onError: (error: Error) => {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Không thể xóa đánh giá. Vui lòng thử lại sau.",
        });
      },
    });
  };

  const handleUpdateReview = () => {
    if (!editingReview) return;

    updateReview(
      {
        id: editingReview._id,
        data: {
          variant: editingReview.variant,
          rating: editRating,
          comment: editComment,
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Thành công",
            description: "Đã cập nhật đánh giá thành công!",
          });
          setEditingReview(null);
        },
        onError: (error: Error) => {
          toast({
            variant: "destructive",
            title: "Lỗi",
            description: "Không thể cập nhật đánh giá. Vui lòng thử lại sau.",
          });
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Đánh giá sản phẩm</h2>
      {reviews.length === 0 ? (
        <p className="text-gray-500">Chưa có đánh giá nào cho sản phẩm này.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="p-4 bg-gray-50 rounded-lg space-y-2"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{review.user.name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
                {currentUser && currentUser._id === review.user._id && (
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(review)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(review._id)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= review.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      )}

      <Dialog
        open={!!editingReview}
        onOpenChange={() => setEditingReview(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa đánh giá</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Đánh giá:</p>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setEditRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= editRating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="editComment" className="text-sm font-medium">
                Nhận xét:
              </label>
              <Textarea
                id="editComment"
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
                className="w-full h-24"
                placeholder="Hãy chia sẻ cảm nhận của bạn về sản phẩm..."
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setEditingReview(null)}>
              Hủy
            </Button>
            <Button onClick={handleUpdateReview} disabled={isUpdating}>
              {isUpdating ? "Đang cập nhật..." : "Cập nhật"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  );
};

export default ProductReviews;
