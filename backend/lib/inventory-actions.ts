"use server";

import { updateMenuItemStock as updateStock } from "./inventory";

export async function updateMenuItemStock(input: {
  propertyId: string;
  menuItemId: string;
  stockQuantity: number;
  lowStockThreshold?: number;
}) {
  return updateStock(input);
}
