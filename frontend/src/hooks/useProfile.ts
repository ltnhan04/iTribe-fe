import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile, getProfile } from "@/services/auth/authApi";
import { ProfileType } from "@/types/auth";

export const useProfile = () => {
  const queryClient = useQueryClient();
  const {
    data: profile,
    isLoading,
    error,
  } = useQuery<ProfileType>({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  return {
    profile,
    isLoading,
    error,
    updateProfile: updateProfileMutation.mutateAsync,
  };
};
