import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BasicInfoFormValues } from "@/features/companies/BasicInfoForm/types";

interface PutCompanyParams
  extends Omit<BasicInfoFormValues, "recruitment_status"> {
  id: string;
  status: string;
}

export const usePutCompany = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: putCompany } = useMutation({
    mutationFn: async (params: PutCompanyParams) => {
      const { id, ...data } = params;
      const response = await fetch(`/api/v1/companies/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("企業情報の更新に失敗しました");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      queryClient.invalidateQueries({ queryKey: ["company"] });
    },
  });

  return { putCompany };
};
