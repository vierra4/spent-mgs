// types/spend.ts
export type UUID = string;
export type ISODateString = string;

export interface PaginationResponse<T> {
  total: number;
  limit: number;
  offset: number;
  items: T[];
}

export interface ApiError {
  detail: string | Array<{ loc: string[]; msg: string; type: string }>;
}


export type UserRole = 'employee' | 'manager' | 'finance' | 'admin';
export type SpendStatus = 'pending' | 'approved' | 'rejected' | 'blocked' | 'draft';
export type Currency = | 'RWF'|'UGS'|'KSH'|'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD';

export interface Organization {
  id: UUID;
  name: string;
  domain?: string;
  is_active: boolean;
}

export interface User {
  id: UUID;
  email: string;
  full_name: string;
  role: string;
  organization_id: UUID;
  is_active: boolean;
  created_at: ISODateString;
  // Optional relations
  organization?: Organization;
}

export interface Category {
  id: UUID;
  name: string;
  accounting_code?: string;
  organization_id: UUID;
}

export interface Vendor {
  id: UUID;
  name: string;
  normalized_name: string;
  is_blocked: boolean;
}

export interface Spend {
  approvalHistory: any;
  policy_passed: any;
  policy_message: string;
  user_name: any;
  receipt_url: any;
  id: UUID;
  amount: number;
  currency: string;
  spend_date: string;
  source: string;
  description: string | null;
  status: SpendStatus;
  organization_id: UUID;
  user_id: UUID | null;
  vendor_id: UUID | null;
  category_id: UUID | null;
  created_at: ISODateString;
  updated_at: ISODateString;
  // Hydrated Relations (Prefetched by Backend)
  user?: User;
  vendor?: Vendor;
  category?: Category;
  receipts?: Receipt[];
}

export interface Receipt {
  id: UUID;
  spend_event_id: UUID;
  file_url: string;
  extracted_data: ReceiptExtractedData | null;
  is_verified: boolean;
  created_at: ISODateString;
}

export interface ReceiptExtractedData {
  vendor_name: string;
  date?: string;
  total_amount: number;
  currency?: string;
  items?: Array<{
    description: string;
    quantity: number;
    price: number;
  }>;
}

export interface Policy {
  active: any;
  description: ReactNode;
  created_at(created_at: any): import("react").ReactNode;
  id: UUID;
  name: string;
  is_active: boolean;
  rules?: PolicyRule[];
}

export interface PolicyRule {
  id: UUID;
  condition: any; // JSON object from backend
  action: any;    // JSON object from backend
  priority: number;
}

export interface Notification {
  id: UUID;
  title: string;
  message: string;
  read: boolean;
  metadata?: Record<string, any>;
  created_at: ISODateString;
}

export interface AuditLog {
  id: UUID;
  actor_id: UUID | null;
  entity_type: string;
  entity_id: UUID;
  action: string;
  metadata?: Record<string, any>;
  created_at: ISODateString;
}

/*
   Form & Payload Interfaces (For React Hook Form)


/*
 Payload for POST /spends
 */
export interface CreateSpendFormData {
  amount: number;
  currency: string;
  spend_date: string; // HTML date inputs return "YYYY-MM-DD"
  source: string;
  description?: string;
  vendor_id?: string;   // Note: UUID as string
  category_id?: string;
}

export interface UploadReceiptFormData {
  spend_id: UUID;
  file: FileList; //for <input type="file">
}

export interface PolicyRuleFormData {
  condition: string; // Usually stringified JSON in forms
  action: string;
  priority: number;
}

export interface CreatePolicyFormData {
  name: string;
  is_active: boolean;
  rules: PolicyRuleFormData[];
}

/*
 Payload for POST /approvals/{id}/decision
 */
export interface ApprovalDecisionFormData {
  approved: boolean;
  comment?: string;
}

/* 
   API Response Helpers*/
export type SpendListResponse = PaginationResponse<Spend>;
export type NotificationListResponse = PaginationResponse<Notification>;
export type AuditLogListResponse = PaginationResponse<AuditLog>;


export type SpendCategory = 
  | 'travel'
  | 'meals'
  | 'software'
  | 'equipment'
  | 'office_supplies'
  | 'marketing'
  | 'professional_services'
  | 'other'
