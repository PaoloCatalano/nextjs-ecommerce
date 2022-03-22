import useSWR from "swr";

export function useUser(token) {
  const url = "/api/singleUser";

  async function fetcher() {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: token,
      },
    });

    const data = await res.json();
    return data;
  }

  const { data, error } = useSWR(url, fetcher);
  return {
    userSWR: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useProduct(id) {
  const { data, error } = useSWR(id ? `/api/product/${id}` : null);

  return {
    prodSWR: data,
    isLoading: !error && !data,
    isError: error,
  };
}
