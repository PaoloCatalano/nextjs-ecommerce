import "../styles/globals.css";
import Layout from "../components/Layout";
import { DataProvider } from "../store/GlobalState";
import { SWRConfig } from "swr";

function MyApp({ Component, pageProps }) {
  return (
    <SWRConfig
      value={{
        // fetcher: async (url) => {
        //   const res = await fetch(url);
        //   return await res.json();
        // },
        fetcher: (url) => fetch(url).then((r) => r.json()),
        refreshInterval: 5000,
        dedupingInterval: 4000,
      }}
    >
      <DataProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </DataProvider>
    </SWRConfig>
  );
}

export default MyApp;
