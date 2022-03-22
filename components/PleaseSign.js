import Link from "next/link";
import Head from "next/head";
import GoBack from "./GoBack";

export default function PleaseSign() {
  return (
    <div className="home_page">
      <Head>
        <title>Unauthorized Access</title>
      </Head>
      <h1 style={{ textAlign: "center", marginTop: "1rem" }}>
        Unauthorized Access
      </h1>
      <div style={{ display: "grid", placeItems: "center" }}>
        <Link href="/signin">
          <button
            type="button"
            className="btn btn-outline-primary d-block my-3 px-5"
          >
            <a>Please Sign in!</a>
          </button>
        </Link>
      </div>
      <GoBack />
    </div>
  );
}
