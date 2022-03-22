import Link from "next/link";
import Head from "next/head";

import GoBack from "./GoBack";

export default function PleaseSign() {
  return (
    <div className="home_page">
      <Head>
        <title>Product not available</title>
      </Head>
      <h1 style={{ textAlign: "center", marginTop: "1rem" }}>
        Sorry, this product is no longer available
      </h1>
      <div style={{ display: "grid", placeItems: "center" }}>
        <Link href="/">
          <button
            type="button"
            className="btn btn-success w-100 text-uppercase"
          >
            <a> enjoy shopping </a>
          </button>
        </Link>
      </div>
      <GoBack />
    </div>
  );
}
