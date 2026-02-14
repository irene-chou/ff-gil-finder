import type { FetchProgress } from '../lib/xivapi';

interface Props {
  isLoadingRecipes: boolean;
  isLoadingPrices: boolean;
  progress: FetchProgress | null;
}

export function LoadingState({ isLoadingRecipes, isLoadingPrices, progress }: Props) {
  let message = '載入中...';
  if (isLoadingRecipes) message = '正在抓取配方資料...';
  else if (isLoadingPrices) message = '正在抓取市場價格...';

  const percent = progress?.total
    ? Math.round((progress.current / progress.total) * 100)
    : null;

  return (
    <div className="py-8 flex flex-col items-center gap-3">
      <div className="flex items-center gap-3 text-gray-500">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
        <span>{message}</span>
      </div>

      {progress && (
        <>
          <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
            {percent !== null ? (
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${percent}%` }}
              />
            ) : (
              <div className="h-full bg-blue-500 rounded-full animate-pulse w-full opacity-30" />
            )}
          </div>
          <p className="text-sm text-gray-400">{progress.detail}</p>
        </>
      )}
    </div>
  );
}
