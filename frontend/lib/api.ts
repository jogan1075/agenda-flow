const rawApiUrl = String(process.env.NEXT_PUBLIC_API_URL ?? '')
  .trim()
  .replace(/^['"]|['"]$/g, '');
const normalizedBaseUrl = rawApiUrl
  ? rawApiUrl.replace(/\/+$/, '')
  : 'http://localhost:3000/api';
const API_URL = normalizedBaseUrl.endsWith('/api') ? normalizedBaseUrl : `${normalizedBaseUrl}/api`;

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

export type LoginPayload = {
  email: string;
  password: string;
  businessId?: string;
};

export type RegisterPayload = {
  businessId: string;
  fullName: string;
  email: string;
  password: string;
  role: 'owner' | 'admin' | 'staff';
};

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers ?? {}),
      },
      cache: 'no-store',
    });
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'network_error';
    throw new ApiError(`No se pudo conectar con la API (${API_URL}). Detalle: ${detail}`, 0);
  }

  if (!response.ok) {
    const text = await response.text();
    try {
      const json = JSON.parse(text) as { message?: string | string[] };
      const message = Array.isArray(json.message) ? json.message.join(', ') : json.message;
      throw new ApiError(message || `Request failed: ${response.status}`, response.status);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(text || `Request failed: ${response.status}`, response.status);
    }
  }

  return response.json();
}

export const api = {
  login(payload: LoginPayload) {
    return request<{ accessToken: string; user: { businessId: string; role: 'super_admin' | 'owner' | 'admin' | 'staff' } }>(
      '/auth/login',
      {
      method: 'POST',
      body: JSON.stringify(payload),
      },
    );
  },
  createBusiness(payload: Record<string, unknown>) {
    return request('/businesses', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  createOwnerBySuperAdmin(payload: { fullName: string; email: string; password: string }, token: string) {
    return request('/auth/superadmin/create-owner', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  },
  getBusinesses(id: string) {
    return request(`/businesses/${id}`);
  },
  getBusinessTypeCatalog() {
    return request<Record<string, string[]>>('/businesses/catalog/types');
  },
  getBusinessTypeCatalogForSuperAdmin(token: string) {
    return request<Array<Record<string, unknown>>>('/businesses/admin/catalog', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  createBusinessCategory(
    payload: { key?: string; label: string },
    token: string,
  ) {
    return request('/businesses/admin/catalog/categories', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  },
  addBusinessSubcategory(categoryKey: string, payload: { name: string }, token: string) {
    return request(`/businesses/admin/catalog/categories/${categoryKey}/subcategories`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  },
  updateBusinessCategory(categoryKey: string, payload: Record<string, unknown>, token: string) {
    return request(`/businesses/admin/catalog/categories/${categoryKey}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  },
  listBusinessesForSuperAdmin(token: string) {
    return request<Array<Record<string, unknown>>>('/businesses/admin/list', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  updateBusinessSubscription(id: string, payload: Record<string, unknown>, token: string) {
    return request(`/businesses/admin/${id}/subscription`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  },
  updateBusiness(id: string, payload: Record<string, unknown>) {
    return request(`/businesses/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },
  listServices(businessId: string) {
    return request<Array<Record<string, unknown>>>(`/services?businessId=${businessId}`);
  },
  createService(payload: Record<string, unknown>) {
    return request('/services', { method: 'POST', body: JSON.stringify(payload) });
  },
  updateService(id: string, payload: Record<string, unknown>) {
    return request(`/services/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
  },
  deleteService(id: string) {
    return request(`/services/${id}`, { method: 'DELETE' });
  },
  listProfessionals(businessId: string, serviceId?: string) {
    const serviceQuery = serviceId ? `&serviceId=${encodeURIComponent(serviceId)}` : '';
    return request<Array<Record<string, unknown>>>(`/professionals?businessId=${businessId}${serviceQuery}`);
  },
  createProfessional(payload: Record<string, unknown>) {
    return request('/professionals', { method: 'POST', body: JSON.stringify(payload) });
  },
  updateProfessional(id: string, payload: Record<string, unknown>) {
    return request(`/professionals/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
  },
  deleteProfessional(id: string) {
    return request(`/professionals/${id}`, { method: 'DELETE' });
  },
  listCustomers(businessId: string, search = '') {
    const query = search ? `&search=${encodeURIComponent(search)}` : '';
    return request<Array<Record<string, unknown>>>(`/customers?businessId=${businessId}${query}`);
  },
  createCustomer(payload: Record<string, unknown>) {
    return request('/customers', { method: 'POST', body: JSON.stringify(payload) });
  },
  updateCustomer(id: string, payload: Record<string, unknown>) {
    return request(`/customers/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
  },
  deleteCustomer(id: string) {
    return request(`/customers/${id}`, { method: 'DELETE' });
  },
  listAppointments(businessId: string, from: string, to: string) {
    return request<Array<Record<string, unknown>>>(
      `/appointments?businessId=${businessId}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
    );
  },
  createAppointment(payload: Record<string, unknown>) {
    return request('/appointments', { method: 'POST', body: JSON.stringify(payload) });
  },
  updateAppointment(id: string, payload: Record<string, unknown>) {
    return request(`/appointments/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
  },
  reservePublic(payload: Record<string, unknown>) {
    return request<{
      appointment: Record<string, unknown>;
      summary: Record<string, unknown>;
      notifications: { whatsappSent: boolean; emailSent: boolean; emailReason?: string };
      payment?: { provider: string; preferenceId?: string; initPoint?: string; sandboxInitPoint?: string };
    }>('/public-bookings/reserve', { method: 'POST', body: JSON.stringify(payload) });
  },
  basicReport(businessId: string, from: string, to: string) {
    return request<{ totalAppointments: number; byStatus: Array<{ _id: string; count: number }> }>(
      `/reports/basic?businessId=${businessId}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
    );
  },
  processReminders(limit = 50) {
    return request(`/reminders/process-now?limit=${limit}`, { method: 'POST' });
  },
};
