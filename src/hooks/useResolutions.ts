import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ResolutionsService, type Resolution, type ResolutionsParams } from "@/lib/resolutions";

export function useResolutions(params?: ResolutionsParams) {
  const queryClient = useQueryClient();

  const resolutionsQuery = useQuery({
    queryKey: ["resolutions", params],
    queryFn: async () => {
      try {
        const res: any = await ResolutionsService.getResolutions(params);
        console.log("Resolutions response:", res); // DEBUG
        if (res.data && res.data.pagination) {
          return { resolutions: res.data.resolutions, pagination: res.data.pagination };
        }
        if (Array.isArray(res)) return { resolutions: res };
        if (Array.isArray(res.resolutions)) return { resolutions: res.resolutions };
        if (Array.isArray(res.data)) return { resolutions: res.data };
        if (res.data) {
          if (Array.isArray(res.data.data)) return { resolutions: res.data.data };
          if (Array.isArray(res.data.resolutions)) return { resolutions: res.data.resolutions };
        }
        return { resolutions: [] };
      } catch (err) {
        console.error("Error fetching resolutions:", err);
        return { resolutions: [] };
      }
    },
    staleTime: 0,
    refetchOnMount: "always",
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

  const toggleResolutionStatusMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await ResolutionsService.toggleResolutionStatus(id);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resolutions"] });
    },
  });

  const deleteResolutionMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await ResolutionsService.deleteResolution(id);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resolutions"] });
    },
  });

  return {
    resolutions: resolutionsQuery.data?.resolutions || [],
    pagination: resolutionsQuery.data?.pagination,
    isLoading: resolutionsQuery.isLoading,
    error: resolutionsQuery.error,
    refetch: resolutionsQuery.refetch,
    updateResolution: updateResolutionMutation.mutateAsync,
    createResolution: createResolutionMutation.mutateAsync,
    toggleResolutionStatus: toggleResolutionStatusMutation.mutateAsync,
    deleteResolution: deleteResolutionMutation.mutateAsync,
    isUpdating: updateResolutionMutation.isPending || createResolutionMutation.isPending || toggleResolutionStatusMutation.isPending || deleteResolutionMutation.isPending,
  };
}
