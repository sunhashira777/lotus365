export function intoDecimal(odds) {
  if (!odds) return 0;

  const num = Number(odds);

  if (Number.isNaN(num)) return 0;

  // if already decimal (like 1.5, 2.25)
  if (num % 1 !== 0) return num;

  // convert fancy odds (like 100 → 2.00)
  if (num > 0) return parseFloat((num / 100 + 1).toFixed(2));

  return num;
}
export const getOrderedMarkets = (markets, marketTypes) => {
  const orderedMarkets = [];

  for (const type of marketTypes) {
    const key = Object.keys(markets).find(
      (k) => k.toLowerCase() === type.toLowerCase(),
    );

    if (key && markets[key] && markets[key]?.length > 0) {
      orderedMarkets.push(markets[key][0]);
    }
  }

  const addedKeys = new Set(
    marketTypes.map((t) =>
      Object.keys(markets).find((k) => k.toLowerCase() === t.toLowerCase()),
    ),
  );

  const remainingMarkets = Object.entries(markets)
    .filter(([key]) => !addedKeys.has(key))
    .sort(([aKey], [bKey]) => {
      const extractNum = (name) => parseFloat(name.match(/[\d.]+/)?.[0] ?? '0');

      return extractNum(aKey) - extractNum(bKey);
    })
    .map(([_, value]) => value[0])
    .filter(Boolean);

  return [...orderedMarkets, ...remainingMarkets];
};
const REQUIRED_ODDS = {
  3: [
    'match odds',
    'tied',
    'over/under',
    'half time',
    'first half',
    'completed match',
  ],
  1: ['premium'],
};

const fillOdds = (odds, required) => {
  const filled = [...odds];

  while (filled.length < required) {
    filled.push({ price: 0, size: 0 });
  }

  return filled;
};

export const getRequiredOddsCount = (marketName) => {
  if (!marketName) return 1;

  const name = marketName.toLowerCase();

  for (const priority in REQUIRED_ODDS) {
    const patterns = REQUIRED_ODDS[priority];

    if (patterns?.some((p) => name.startsWith(p))) {
      return Number(priority);
    }
  }

  return 1;
};
export const formatRunners = (marketDetails, marketParentCategory) => {
  if (!marketDetails || !marketDetails.runners) return [];

  const runners = Array.isArray(marketDetails.runners)
    ? [...marketDetails.runners]
    : [marketDetails.runners];

  const requiredOdds = getRequiredOddsCount(marketDetails.marketName);

  return runners
    .sort((a, b) => (a.sortPriority ?? 0) - (b.sortPriority ?? 0))
    .map((r) => {
      const back = [
        ...(r?.backPrice3 ? [{ price: r.backPrice3, size: r.backSize3 }] : []),
        ...(r?.backPrice2 ? [{ price: r.backPrice2, size: r.backSize2 }] : []),
        ...(r?.backPrice1 ? [{ price: r.backPrice1, size: r.backSize1 }] : []),
      ];

      const lay = [
        ...(r?.layPrice1 ? [{ price: r.layPrice1, size: r.laySize1 }] : []),
        ...(r?.layPrice2 ? [{ price: r.layPrice2, size: r.laySize2 }] : []),
        ...(r?.layPrice3 ? [{ price: r.layPrice3, size: r.laySize3 }] : []),
      ];

      return {
        selectionId: r.selectionId ? r.selectionId : r?.runnerId,
        sortPriority: r.sortPriority,
        runnerName: r.runnerName,
        status: r.status,
        back: fillOdds(back, requiredOdds),
        lay:
          marketParentCategory !== 'premium'
            ? fillOdds(lay, requiredOdds)
            : lay,
      };
    });
};

export const valueFormatter = Intl.NumberFormat('en', {
  notation: 'compact',
  compactDisplay: 'short',
  maximumFractionDigits: 1,
});
export const calculateProfitLoss = (
  marketCategory,
  bet,
  currentEventId,
  currentSelectionId,
  currentMarketId,
) => {
  if (bet?.eventId != currentEventId || bet?.marketId != currentMarketId) {
    return null;
  }

  const stake = Number(bet?.stake || 0);
  const rate =
    marketCategory === 'FANCY'
      ? intoDecimal(bet?.fancyPercentage)
      : Number(bet?.rate);

  const isSameRunner = bet?.selectionId == currentSelectionId;

  let profit;
  const loss = stake;
  let exposure = 0;

  if (
    marketCategory === 'NORMAL' &&
    ((bet?.marketName ?? '').toLowerCase().includes('bookmaker') ||
      (bet?.marketName ?? '').toLowerCase().includes('toss'))
  ) {
    profit = (rate / 100) * stake;
  } else {
    profit = Number(((rate - 1) * stake).toFixed(2));
  }

  if (bet.betOn === 'BACK') {
    exposure += isSameRunner ? profit : -loss;
  } else if (bet.betOn === 'LAY') {
    exposure += isSameRunner ? -profit : loss;
  }

  return exposure;
};
export const formatNumber = (num, locale = 'en-US') => {
  if (num == null || isNaN(Number(num))) return '0';

  const safeNumber = Number(num);

  return safeNumber.toLocaleString(locale, {
    maximumFractionDigits: 2,
  });
};
export const formatDate = (isoDate) => {
  if (!isoDate) return '-';

  const date = new Date(isoDate);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};
