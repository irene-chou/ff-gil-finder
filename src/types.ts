export interface CraftingJob {
  displayName: string;
  craftTypeId: number;
  icon: string;
}

export interface RecipeIngredient {
  itemId: number;
  name: string;
  quantity: number;
}

export interface Recipe {
  rowId: number;
  name: string;
  resultItemId: number;
  amountResult: number;
  level: number;
  requiresBook: boolean;
  ingredients: RecipeIngredient[];
}

export interface CachedRecipeData {
  craftTypeId: number;
  fetchedAt: string;
  recipes: Recipe[];
}

export interface MarketPriceInfo {
  minPriceNQ: number;
  minPriceHQ: number;
  minPrice: number;
  lastUploadTime: number;
  lastSaleTime: number;         // recentHistory[0].timestamp (seconds), 0 if no sales
  hasData: boolean;
  listingsCount: number;
}

export interface ProfitFilters {
  maxLevel: number | null;     // null = no limit
  skipBook: boolean;           // true = hide secret recipe book recipes
  saleDays: number;            // only show items sold within N days
}

export interface ProfitResult {
  recipeName: string;
  resultItemId: number;
  salePrice: number;
  craftingCost: number;
  profit: number;
  profitMargin: number;
  dataFreshness: string;
  ingredients: Array<{
    name: string;
    itemId: number;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }>;
}
