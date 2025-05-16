import { createClient } from "@/lib/supabase/server";

interface GetCompaniesParams {
  userId: string;
  page: number;
  perPage: number;
  query: string;
  sort: string;
  order: "asc" | "desc";
  recruitmentStatus?: string;
  nextEvent?: string;
}

/**
 * 企業情報を取得するクエリを実行する
 */
export async function getCompaniesQuery({
  userId,
  page,
  perPage,
  query,
  sort,
  order,
  recruitmentStatus,
  nextEvent,
}: GetCompaniesParams) {
  const supabase = await createClient();
  const offset = (page - 1) * perPage;

  // ユーザーIDに紐づく企業情報の取得
  let companiesQuery = supabase.from("companies")
    .select(
      `
      *,
      events (
        scheduled_at
      )
    `,
      { count: "exact" },
    )
    .eq("user_id", userId);

  // 検索クエリがある場合は検索条件を追加
  if (query) {
    companiesQuery = companiesQuery.or(
      `name.ilike.%${query}%,industry.ilike.%${query}%`,
    );
  }

  console.log(recruitmentStatus);
  // 選考状況でフィルタリング
  if (recruitmentStatus && recruitmentStatus !== "all") {
    companiesQuery = companiesQuery.eq("status", recruitmentStatus);
  }

  // 次回選考日時でフィルタリング
  if (nextEvent && nextEvent !== "all") {
    const now = new Date();
    const endDate = new Date();

    switch (nextEvent) {
      case "within_week":
        endDate.setDate(now.getDate() + 7);
        break;
      case "within_two_weeks":
        endDate.setDate(now.getDate() + 14);
        break;
      case "within_month":
        endDate.setMonth(now.getMonth() + 1);
        break;
    }

    companiesQuery = companiesQuery
      .gte("next_event_date", now.toISOString())
      .lte("next_event_date", endDate.toISOString());
  }

  // ソート条件を追加
  if (sort === "next_event_date") {
    // 次回選考日時でソートする場合
    const { data, error, count } = await companiesQuery
      .order("created_at", { ascending: order === "asc" })
      .range(offset, offset + perPage - 1);

    if (error) {
      throw error;
    }

    // 取得したデータをソート
    const sortedData = (data || []).sort((a, b) => {
      const aDate = a.events?.[0]?.scheduled_at;
      const bDate = b.events?.[0]?.scheduled_at;

      if (!aDate && !bDate) return 0;
      if (!aDate) return order === "asc" ? 1 : -1;
      if (!bDate) return order === "asc" ? -1 : 1;

      return order === "asc"
        ? new Date(aDate).getTime() - new Date(bDate).getTime()
        : new Date(bDate).getTime() - new Date(aDate).getTime();
    });

    return {
      data: sortedData,
      count: count || 0,
    };
  } else {
    // 通常のソート
    const { data, error, count } = await companiesQuery
      .order(sort, { ascending: order === "asc" })
      .range(offset, offset + perPage - 1);

    if (error) {
      throw error;
    }

    return {
      data: data || [],
      count: count || 0,
    };
  }
}
