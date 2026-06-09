export type InventoryRow = {
  id: string;
  name: string;
  category: string;
  stockQuantity: number;
  lowStockThreshold: number;
  isAvailable: boolean;
};
