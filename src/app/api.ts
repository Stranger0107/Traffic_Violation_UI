const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

export type UserRole = 'admin' | 'officer' | 'citizen';
export type ViolationStatus = 'pending_review' | 'issued' | 'contested' | 'paid' | 'invalidated' | 'rejected';
export type GrievanceStatus = 'open' | 'approved' | 'rejected';

export interface AuthResponse {
  access_token: string;
  token_type: string;
  role: UserRole;
  username: string;
}

export interface ViolationRecord {
  id: string;
  plateNumber: string;
  violation: string;
  fine: number;
  timestamp: string;
  status: ViolationStatus;
  ownerName: string;
}

export interface GrievanceRecord {
  id: string;
  violationId: string;
  plateNumber: string;
  reason: string;
  status: GrievanceStatus;
  adminRemark: string;
  createdAt: string;
  challan: ViolationRecord | null;
}

export interface DashboardSummary {
  totalViolations: number;
  openGrievances: number;
  revenueCollected: number;
  processingRate: number;
}

export interface ResolveGrievancePayload {
  grievance_id: number;
  action: 'approve' | 'reject';
  admin_remark: string;
}

const TOKEN_KEY = 'auth_token';
const ROLE_KEY = 'auth_role';
const USERNAME_KEY = 'auth_username';

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setUserRole(role: UserRole) {
  localStorage.setItem(ROLE_KEY, role);
}

export function getUserRole(): UserRole | null {
  const role = localStorage.getItem(ROLE_KEY);
  return role === 'admin' || role === 'officer' || role === 'citizen' ? role : null;
}

export function setUsername(username: string) {
  localStorage.setItem(USERNAME_KEY, username);
}

export function getUsername(): string | null {
  return localStorage.getItem(USERNAME_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(USERNAME_KEY);
}

async function request<T>(path: string, options: RequestInit = {}, includeAuth = true): Promise<T> {
  const headers = new Headers(options.headers);
  if (includeAuth) {
    const token = getToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const contentType = res.headers.get('content-type') ?? '';
  const data = contentType.includes('application/json') ? await res.json() : null;

  if (!res.ok) {
    throw new Error(data?.detail || data?.message || 'Request failed');
  }

  return data as T;
}

function normalizeViolation(raw: any): ViolationRecord {
  return {
    id: String(raw.vehicle_id ?? raw.id ?? ''),
    plateNumber: raw.plate_number ?? raw.plateNumber ?? '',
    violation: raw.violation ?? raw.violation_type ?? '',
    fine: Number(raw.fine ?? 0),
    timestamp: raw.timestamp ?? '',
    status: raw.status,
    ownerName: raw.owner_name ?? raw.ownerName ?? 'Unknown',
  };
}

function normalizeGrievance(raw: any): GrievanceRecord {
  return {
    id: String(raw.id ?? ''),
    violationId: String(raw.violation_id ?? raw.violationId ?? ''),
    plateNumber: raw.plate_number ?? raw.plateNumber ?? '',
    reason: raw.reason ?? '',
    status: raw.status,
    adminRemark: raw.admin_remark ?? raw.adminRemark ?? '',
    createdAt: raw.created_at ?? raw.createdAt ?? '',
    challan: raw.challan ? normalizeViolation(raw.challan) : null,
  };
}

export async function login(username: string, password: string): Promise<AuthResponse> {
  const data = await request<AuthResponse>('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  }, false);

  setToken(data.access_token);
  setUserRole(data.role);
  setUsername(data.username);

  return data;
}

export async function register(username: string, password: string, plateNumber: string) {
  return request<{ message: string }>('/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, plateNumber }),
  }, false);
}

export async function getAdminViolations(): Promise<ViolationRecord[]> {
  const data = await request<any[]>('/admin/violations');
  return data.map(normalizeViolation);
}

export async function getAdminGrievances(): Promise<GrievanceRecord[]> {
  const data = await request<any[]>('/admin/grievances');
  return data.map(normalizeGrievance);
}

export async function resolveGrievance(payload: ResolveGrievancePayload) {
  return request<any>('/admin/resolve-grievance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function getPendingChallans(): Promise<ViolationRecord[]> {
  const data = await request<any[]>('/officer/pending-challans');
  return data.map(normalizeViolation);
}

export async function reviewChallan(challanId: number, action: 'approve' | 'reject') {
  return request<any>('/officer/review-challan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ challan_id: challanId, action }),
  });
}

export async function uploadTrafficVideo(video: File) {
  const formData = new FormData();
  formData.append('video', video);

  return request<any>('/officer/upload-video', {
    method: 'POST',
    body: formData,
  });
}

export async function getMyChallans(): Promise<ViolationRecord[]> {
  const data = await request<any[]>('/citizen/my-challans');
  return data.map(normalizeViolation);
}

export async function getMyGrievances(): Promise<GrievanceRecord[]> {
  const data = await request<any[]>('/citizen/grievances');
  return data.map(normalizeGrievance);
}

export async function submitGrievance(challanId: number, reason: string) {
  return request<any>('/citizen/grievance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ challan_id: challanId, reason }),
  });
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const violations = await getAdminViolations();
  const grievances = await getAdminGrievances();
  const issuedViolations = violations.filter((violation) => violation.status === 'issued');
  const paidViolations = violations.filter((violation) => violation.status === 'paid');

  return {
    totalViolations: violations.length,
    openGrievances: grievances.filter((grievance) => grievance.status === 'open').length,
    revenueCollected: paidViolations.reduce((total, violation) => total + violation.fine, 0),
    processingRate: violations.length === 0 ? 0 : Math.round((issuedViolations.length / violations.length) * 1000) / 10,
  };
}

export async function getOfficers() {
  return request<any[]>('/admin/officers');
}

export async function createOfficer(username: string, password: string) {
  return request<any>('/admin/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, role: 'officer' }),
  });
}

export async function deleteOfficer(id: number) {
  return request<any>(`/admin/officers/${id}`, {
    method: 'DELETE',
  });
}

export async function changeOfficerPassword(oldPassword: string, newPassword: string) {
  return request<any>('/officer/change-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
  });
}

