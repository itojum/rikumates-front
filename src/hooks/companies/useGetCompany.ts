import { Company } from "@/types/database";
import { useEffect, useState } from "react";

export const useGetCompany = (id: string) => {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await fetch(`/api/v1/companies/${id}`);
        if (!response.ok) {
          throw new Error("企業情報の取得に失敗しました");
        }

        const data = await response.json();
        setCompany(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "予期せぬエラーが発生しました",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [id]);

  return { company, loading, error };
};
