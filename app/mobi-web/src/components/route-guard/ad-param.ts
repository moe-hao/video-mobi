export function storeAdParam(
  searchParams: URLSearchParams,
  setSearchParams: (params: URLSearchParams) => void,
) {
  const paramKeys = ['p', 'creative_id', 'adset_id', 'campaign_id', 'fbclid', 'ttclid'];

  for (const key of paramKeys) {
    const value = searchParams.get(key);
    if (value) {
      localStorage.setItem(key, value);
    }

    const localStorageValue = localStorage.getItem(key);
    if (!value && localStorageValue) {
      searchParams.set(key, localStorageValue);
    }
  }

  setSearchParams(searchParams);
}
