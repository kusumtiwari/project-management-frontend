import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { request } from "../../utils/request";
import { APIENDPOINTS, getAPIAUTHHEADERS } from "../../constants/APIEndpoints";
import { handleAPIResponse } from "../../utils/handleAPIResponse";
import type { ApiResponse } from "@/types/api/apiresponse";
import type { DashboardSummary } from "@/types/dashboard/dashboard";

export const DASHBOARD_QUERY_KEYS = {
  summary: ["dashboard-summary"],
};
interface DashboardSummaryResponse {
  status: number;
  data: {
    message?: string;
    summary?: any;
  };
}

export const useDashboardActions = () => {
  const query = useQuery<ApiResponse<DashboardSummary>>({
    queryKey: DASHBOARD_QUERY_KEYS.summary,
    queryFn: () =>
      request(APIENDPOINTS.DASHBOARD_SUMMARY, {
        headers: getAPIAUTHHEADERS(),
      }),
  });

  const summary = query.data?.data.data;

  if (query.isSuccess) {
    const { status, data } = query.data;
    const apiResult = handleAPIResponse(status, data?.message);

    if (!apiResult.success) {
      toast.error(apiResult.message);
    }
  }

  if (query.isError) {
    toast.error("Failed to load dashboard summary");
  }

  return {
    ...query,
    summary,
  };
};
