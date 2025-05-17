import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { DetailCompany } from "@/types/types";

interface CompaniesResponse {
  data: DetailCompany[];
  totalPages: number;
}

export const useGetCompanies = () => {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const perPage = Number(searchParams.get("per_page")) || 10;
  const sort = searchParams.get("sort") || "name";
  const order = (searchParams.get("order") as "asc" | "desc") || "asc";
  const recruitmentStatus = searchParams.get("recruitment_status") || "all";
  const nextEvent = searchParams.get("next_event") || "all";
  const query = searchParams.get("query") || "";

  return useQuery<CompaniesResponse>({
    queryKey: [
      "companies",
      {
        page,
        perPage,
        sort,
        order,
        recruitmentStatus,
        nextEvent,
        query,
      },
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("page", page.toString());
      params.set("per_page", perPage.toString());
      params.set("sort", sort);
      params.set("order", order);
      if (recruitmentStatus !== "all") {
        params.set("recruitment_status", recruitmentStatus);
      }
      if (nextEvent !== "all") {
        params.set("next_event", nextEvent);
      }
      if (query) {
        params.set("query", query);
      }

      const response = await fetch(`/api/v1/companies?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch companies");
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5分間はデータを新鮮とみなす
    gcTime: 1000 * 60 * 30, // 30分間キャッシュを保持
    placeholderData: (previousData) => previousData, // 新しいデータを取得中も前のデータを表示
  });
};
