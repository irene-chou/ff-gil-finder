import { useState } from 'react';
import type { ProfitResult } from '@shared/types.js';
import { TOP_N } from '@shared/constants.js';

interface Props {
  results: ProfitResult[];
  world: string;
  jobName: string;
  itemNames?: Map<number, string>;
}

function formatGil(amount: number): string {
  return amount.toLocaleString('en-US') + 'g';
}

function resolveName(itemId: number, fallback: string, itemNames?: Map<number, string>): string {
  return itemNames?.get(itemId) ?? fallback;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      className="ml-2 inline-flex items-center text-gray-500 hover:text-gold-400 transition-colors cursor-pointer"
      title="複製名稱"
    >
      {copied ? (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  );
}

export function ResultsTable({ results, world, jobName, itemNames }: Props) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const top = results.slice(0, TOP_N);

  const profitable = results.filter(r => r.profit > 0).length;

  return (
    <div>
      <h2 className="text-lg font-bold mb-4 text-gray-200">
        {world} · {jobName} · 利潤 TOP {TOP_N} 🏆
      </h2>

      {top.length === 0 ? (
        <p className="text-gray-500 py-4">找不到有市場資料的可獲利配方 😢</p>
      ) : (
        <div className="space-y-3">
          {top.map((r, i) => {
            const displayName = resolveName(r.resultItemId, r.recipeName, itemNames);
            const isExpanded = expandedIndex === i;

            return (
              <div key={r.resultItemId} className="rounded-lg border border-dark-600 bg-dark-800 overflow-hidden">
                <button
                  onClick={() => setExpandedIndex(isExpanded ? null : i)}
                  className="w-full text-left px-4 py-3 hover:bg-dark-700 transition-colors cursor-pointer"
                >
                  <div className="flex items-baseline justify-between">
                    <span className="font-medium text-gray-200">
                      #{i + 1} {displayName}
                      <CopyButton text={displayName} />
                    </span>
                    <span className={`text-lg font-bold ${r.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {r.profit >= 0 ? '+' : ''}{formatGil(r.profit)}
                    </span>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-500 mt-1">
                    <span>售價: {formatGil(r.salePrice)}</span>
                    <span>成本: {formatGil(r.craftingCost)}</span>
                    <span className={r.profitMargin >= 0 ? 'text-green-400' : 'text-red-400'}>
                      利潤率: {r.profitMargin}%
                    </span>
                    <span>最後成交: {r.dataFreshness}</span>
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-dark-600 bg-dark-700/50 px-4 py-3">
                    <div className="flex items-center gap-3 mb-3">
                      <a
                        href={`https://universalis.app/market/${r.resultItemId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs px-2 py-1 rounded border border-dark-600 text-gray-400 hover:text-gold-400 hover:border-gold-500/50 transition-colors"
                      >
                        Universalis 市場
                      </a>
                      <a
                        href={`https://ffxivteamcraft.com/db/zh/item/${r.resultItemId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs px-2 py-1 rounded border border-dark-600 text-gray-400 hover:text-gold-400 hover:border-gold-500/50 transition-colors"
                      >
                        Teamcraft 配方
                      </a>
                    </div>

                    {r.ingredients.length > 0 && (
                      <>
                        <p className="text-xs font-medium text-gray-500 mb-2">素材</p>
                        <div className="space-y-1">
                          {r.ingredients.map((ing) => (
                            <div key={ing.itemId} className="flex justify-between text-sm text-gray-400">
                              <span>
                                {ing.quantity}x {resolveName(ing.itemId, ing.name, itemNames)}
                              </span>
                              <span className="text-gray-500">
                                @ {formatGil(ing.unitPrice)} = {formatGil(ing.subtotal)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <p className="text-sm text-gray-500 mt-4">
        共 {results.length} 個有市場資料的配方，其中 {profitable} 個可獲利
      </p>
    </div>
  );
}
