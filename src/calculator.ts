import { MARKET_TAX_RATE } from './constants.js';
import type { MarketPriceInfo, ProfitFilters, ProfitResult, Recipe } from './types.js';

const DEFAULT_FILTERS: ProfitFilters = {
  maxLevel: null,
  skipBook: true,
  saleDays: 1,
};

/** Format lastSaleTime (seconds) as relative time string */
function formatFreshness(timestampSec: number): string {
  if (!timestampSec) return '無交易紀錄';
  const ageMs = Date.now() - timestampSec * 1000;
  const hours = Math.floor(ageMs / (1000 * 60 * 60));
  if (hours < 1) return '<1 小時前';
  if (hours < 24) return `${hours} 小時前`;
  const days = Math.floor(hours / 24);
  return `${days} 天前`;
}

export function calculateProfits(
  recipes: Recipe[],
  priceMap: Map<number, MarketPriceInfo>,
  filters: Partial<ProfitFilters> = {},
): ProfitResult[] {
  const { maxLevel, skipBook, saleDays } = { ...DEFAULT_FILTERS, ...filters };
  const saleCutoffMs = saleDays * 24 * 60 * 60 * 1000;
  const results: ProfitResult[] = [];
  const now = Date.now();

  for (const recipe of recipes) {
    // Filter: skip secret recipe book recipes
    if (skipBook && recipe.requiresBook) continue;

    // Filter: level cap
    if (maxLevel !== null && recipe.level > maxLevel) continue;

    const resultPrice = priceMap.get(recipe.resultItemId);
    if (!resultPrice || !resultPrice.hasData || resultPrice.minPrice === 0) continue;

    // Filter: recent sale within N days
    if (!resultPrice.lastSaleTime) continue;
    const saleAgeMs = now - resultPrice.lastSaleTime * 1000;
    if (saleAgeMs > saleCutoffMs) continue;

    let craftingCost = 0;
    let skipRecipe = false;
    const ingredientDetails: ProfitResult['ingredients'] = [];

    for (const ing of recipe.ingredients) {
      const ingPrice = priceMap.get(ing.itemId);
      if (!ingPrice || !ingPrice.hasData || ingPrice.minPrice === 0) {
        skipRecipe = true;
        break;
      }
      const subtotal = ingPrice.minPrice * ing.quantity;
      craftingCost += subtotal;
      ingredientDetails.push({
        name: ing.name,
        itemId: ing.itemId,
        quantity: ing.quantity,
        unitPrice: ingPrice.minPrice,
        subtotal,
      });
    }

    if (skipRecipe) continue;

    const salePrice = resultPrice.minPrice;
    const netSale = salePrice * (1 - MARKET_TAX_RATE);
    const profit = netSale - craftingCost;
    const profitMargin = craftingCost > 0 ? (profit / craftingCost) * 100 : 0;

    results.push({
      recipeName: recipe.name,
      resultItemId: recipe.resultItemId,
      salePrice,
      craftingCost,
      profit: Math.round(profit),
      profitMargin: Math.round(profitMargin * 10) / 10,
      dataFreshness: formatFreshness(resultPrice.lastSaleTime),
      ingredients: ingredientDetails,
    });
  }

  results.sort((a, b) => b.profit - a.profit);
  return results;
}
