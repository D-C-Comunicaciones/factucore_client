import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ResolutionsService, type Resolution } from "@/lib/resolutions";

export function useResolutions() {
  const queryClient = useQueryClient();

  const resolutionsQuery = useQuery({
    queryKey: ["resolutions"],
    queryFn: async () => {
      const res: any = await ResolutionsService.getResolutions();
      if (Array.isArray(res)) return res;
      if (res && Array.isArray(res.data)) return res.data;
      if (res && res.data && Array.isArray(res.data.data)) return res.data.data;
      return [];
    },
  });

  const updateResolutionMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Resolution> }) => {
      const res = await ResolutionsService.updateResolution(id, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resolutions"] });
    },
  });

  return {
    resolutions: resolutionsQuery.data || [],
    isLoading: resolutionsQuery.isLoading,
    error: resolutionsQuery.error,
    updateResolution: updateResolutionMutation.mutateAsync,
    isUpdating: updateResolutionMutation.isPending,
  };
}
