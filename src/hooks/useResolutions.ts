import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ResolutionsService, type Resolution } from "@/lib/resolutions";

export function useResolutions() {
  const queryClient = useQueryClient();

  const resolutionsQuery = useQuery({
    queryKey: ["resolutions"],
    queryFn: async () => {
      try {
        const res: any = await ResolutionsService.getResolutions();
        console.log("Resolutions response:", res); // DEBUG
        if (!res) return [];
        if (Array.isArray(res)) return res;
        if (Array.isArray(res.resolutions)) return res.resolutions;
        if (Array.isArray(res.data)) return res.data;
        if (res.data) {
          if (Array.isArray(res.data.data)) return res.data.data;
          if (Array.isArray(res.data.resolutions)) return res.data.resolutions;
        }
        return [];
      } catch (err) {
        console.error("Error fetching resolutions:", err);
        return [];
      }
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

  const createResolutionMutation = useMutation({
    mutationFn: async (data: Partial<Resolution>) => {
      const res = await ResolutionsService.createResolution(data);
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
    createResolution: createResolutionMutation.mutateAsync,
    isUpdating: updateResolutionMutation.isPending || createResolutionMutation.isPending,
  };
}
