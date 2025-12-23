// src/types/schema.ts

// ====================================================================
// Interfaces Base
// ====================================================================

/**
 * Campos comunes de auditoría presentes en la mayoría de modelos.
 */
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt?: Date; // Algunos modelos como SyncLog o Chat no tienen updatedAt
}

// ====================================================================
// 1. CLIENT
// ====================================================================

export interface Client extends BaseEntity {
  name: string;
  email: string;
  password?: string; // Opcional por seguridad en frontend
  status: string;
  // Relaciones
  businesses?: Business[];
}

// ====================================================================
// 2. BUSINESS
// ====================================================================

export interface Business extends BaseEntity {
  clientId: string;
  name: string;
  address: string;
  phone: string;
  currency: string;
  taxRate: number; // Float
  maxTables: number; // Int
  theme: string; // Puede ser null en BD, string vacío o definido aquí
  status: string;
  // Relaciones
  client?: Client;
  users?: User[];
  floors?: Floor[]; // NUEVO: Relación con Pisos
  // tables?: Table[];  // ELIMINADO: Las mesas ahora acceden vía Floors
  products?: Product[];
  chats?: Chat[];
  notifications?: Notification[];
}

// ====================================================================
// 3. FLOOR (NUEVA ENTIDAD)
// ====================================================================

export interface Floor extends BaseEntity {
  businessId: string;
  name: string;
  // Relaciones
  business?: Business;
  tables?: Table[];
}

// ====================================================================
// 4. USER
// ====================================================================

export interface User extends BaseEntity {
  businessId: string;
  name: string;
  email: string;
  password?: string;
  role: string;
  lastLogin: Date | null;
  status: string;
  // Relaciones
  business?: Business;
  orders?: Order[];
  orderHistories?: OrderHistory[];
  chats?: Chat[]; // Relación "ChatSender"
}

// ====================================================================
// 5. TABLE
// ====================================================================
export interface Table {
  id: string;
  floorId: string; // CRÍTICO: ID del piso al que pertenece la mesa.

  name: string;
  coordX: number; // Float
  coordY: number; // Float
  capacity: number; // Int
  status?: string;

  // 🚨 CAMPOS DE VISUALIZACIÓN AÑADIDOS
  shape: string; // Ej: "circle", "rectangle" [cite: 219]
  color: string; // Ej: "#FF5733" [cite: 220]

  // Relaciones
  floor?: Floor; // Relación 1:N con el piso
  orders?: Order[]; // Pedidos activos en esta mesa
}
// ====================================================================
// 6. PRODUCT
// ====================================================================

export interface Product extends BaseEntity {
  businessId: string;
  name: string;
  description: string;
  price: number; // Float
  available: boolean;
  category: string;
  // Relaciones
  business?: Business;
  orderItems?: OrderItem[];
}

// ====================================================================
// 7. ORDER
// ====================================================================

export interface Order extends BaseEntity {
  tableId: string;
  userId: string;
  status: string;
  subtotal: number; // Float
  tax: number; // Float
  total: number; // Float
  tip: number; // Float
  discount: number; // Float
  // Relaciones
  table?: Table;
  user?: User;
  items?: OrderItem[];
  histories?: OrderHistory[];
}

// ====================================================================
// 8. ORDER ITEM
// ====================================================================

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number; // Int
  unitPrice: number; // Float
  total: number; // Float
  note: string | null;
  // Relaciones
  order?: Order;
  product?: Product;
}

// ====================================================================
// 9. ORDER HISTORY
// ====================================================================

export interface OrderHistory {
  id: string;
  orderId: string;
  previousStatus: string;
  newStatus: string;
  userId: string;
  changedAt: Date;
  // Relaciones
  order?: Order;
  user?: User;
}

// ====================================================================
// 10. CHAT
// ====================================================================

export interface Chat {
  id: string;
  businessId: string;
  senderId: string;
  message: string;
  type: string;
  sentAt: Date;
  read: boolean;
  // Relaciones
  business?: Business;
  sender?: User;
}

// ====================================================================
// 11. NOTIFICATION
// ====================================================================

export interface Notification {
  id: string;
  businessId: string;
  type: string;
  message: string;
  createdAt: Date;
  read: boolean;
  // Relaciones
  business?: Business;
}

// ====================================================================
// 12. SYNC LOG
// ====================================================================

export interface SyncLog {
  id: string;
  entity: string;
  entityId: string;
  operation: string; // "INSERT" | "UPDATE" | "DELETE"
  dataJson: string; // Stringified JSON
  createdAt: Date;
}

export interface ProductType {
  id: string;
  businessId: string;
  name: string;
  description: string;
  price: number;
  available: boolean;
  category: string;
  createdAt: string;
  updatedAt: string;
}