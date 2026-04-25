export async function postData(url, data) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return response.json();
}

export async function getData(url) {
  const response = await fetch(url, {
    method: 'GET',
  });

  return response.json();
}
export const getMarketCategories = (market, sportName) => {
  if (sportName === 'Football') {
    return ['All', '1X2', 'Match', 'Total', 'Handicap', 'Odd/Even'];
  }

  return ['All', ...Object.keys(market || {})];
};
