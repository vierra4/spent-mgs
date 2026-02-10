import { useAuth0 } from "@auth0/auth0-react";
import { useCallback } from "react";
import { 
  Spend, 
  PaginatedResponse, 
  CreateSpendFormData, 
  Notification, 
  User,
  Policy,
  AuditLogEntry, 
  Category
} from "@/types/spend";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const useApi = () => {
  const { getAccessTokenSilently } = useAuth0();

  /*
    Core Request Wrapper
    Handles Token injection and Error parsing
   */
  const request = useCallback(async <T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> => {
    try {
      const token = await getAccessTokenSilently();
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Unknown API Error" }));
        throw new Error(errorData.detail || "API Request Failed");
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error: any) {
      console.error(`[API Error] ${endpoint}:`, error.message);
      throw error;
    }
  }, [getAccessTokenSilently]);

  /*
    Helper to convert objects to query strings
    e.g., { page: 1, type: 'spend' } => "?page=1&type=spend"
   */
  const buildQueryString = (params: Record<string, any>) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
  };

  return {
    // User / Auth 
    getMe: () => request<User>("/users/me"),

    // Spends
    getSpends: (filters: any = {}) => 
      request<PaginatedResponse<Spend>>(`/spends${buildQueryString(filters)}`),

    getPendingSpends: (page: number = 1, pageSize: number = 10) => 
      request<PaginatedResponse<Spend>>(`/spends${buildQueryString({ status: 'pending', page, limit: pageSize })}`),
      
    getSpend: (id: string) => 
      request<Spend>(`/spends/${id}`),

    createSpend: (data: CreateSpendFormData) => 
      request<Spend>("/spends", { 
        method: "POST", 
        body: JSON.stringify(data) 
      }),

    //Receipts
    uploadReceipt: async (spendId: string, file: File) => {
      const token = await getAccessTokenSilently();
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_BASE_URL}/receipts?spend_id=${spendId}`, {
        method: "POST",
        body: formData,
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      
      if (!response.ok) throw new Error("Receipt upload failed");
      return response.json();
    },

    // Approvals 
    submitDecision: (spendId: string, data: { status: 'approved' | 'rejected', comment?: string }) => 
      request<Spend>(`/approvals/${spendId}/decision`, {
        method: "POST",
        body: JSON.stringify(data)
      }),

    // Specific wrappers for the UI components
    approveSpend: (spendId: string, userId: string, userName: string, comment: string) => 
      request<Spend>(`/approvals/${spendId}/approve`, {
        method: "POST",
        body: JSON.stringify({ userId, userName, comment })
      }),

    rejectSpend: (spendId: string, userId: string, userName: string, comment: string) => 
      request<Spend>(`/approvals/${spendId}/reject`, {
        method: "POST",
        body: JSON.stringify({ userId, userName, comment })
      }),

    //  Policies 
    getPolicies: () => request<Policy[]>("/policies"),
    
    createPolicy: (data: Partial<Policy>) => 
      request<Policy>("/policies", {
        method: "POST",
        body: JSON.stringify(data)
      }),

    togglePolicy: (id: string) => 
      request<Policy>(`/policies/${id}/toggle`, { method: "POST" }),

    deletePolicy: (id: string) => 
      request<void>(`/policies/${id}`, { method: "DELETE" }),

    //  Metadata / Helpers 
    getCategories: () => request<Category[]>("/categories"),

    //  Notifications 
    getNotifications: (params: { page?: number; pageSize?: number; unreadOnly?: boolean } = {}) => 
      request<PaginatedResponse<Notification>>(`/notifications${buildQueryString(params)}`),
      
    markNotificationRead: (id: string) => 
      request<void>(`/notifications/${id}/read`, { method: "POST" }),

    markAllNotificationsRead: (userId: string) => 
      request<void>(`/notifications/mark-all-read`, { 
        method: "POST",
        body: JSON.stringify({ userId }) 
      }),

    //  Audit Logs 
    getAuditLogs: (filters: { 
      page?: number; 
      pageSize?: number; 
      action?: string; 
      entityType?: string 
    }) => 
      request<PaginatedResponse<AuditLogEntry>>(`/audit-logs${buildQueryString(filters)}`),
  };
};