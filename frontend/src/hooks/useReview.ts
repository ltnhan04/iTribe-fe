import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createReview,
  updateReview,
  deleteReview,
} from "@/services/review/reviewApi";

export const useReview = () => {
  const queryClient = useQueryClient();

  const createReviewMutation = useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });

  const updateReviewMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { variant: string; rating?: number; comment?: string } }) =>
      updateReview(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });

  const deleteReviewMutation = useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });

  return {
    createReview: createReviewMutation.mutate,
    updateReview: updateReviewMutation.mutate,
    deleteReview: deleteReviewMutation.mutate,
    isCreating: createReviewMutation.isPending,
    isUpdating: updateReviewMutation.isPending,
    isDeleting: deleteReviewMutation.isPending,
  };
};
