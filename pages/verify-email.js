import { useEffect, useContext, useState } from "react";
import Link from "next/link";
import { postData } from "../utils/fetchData";
import { DataContext } from "../store/GlobalState";
import { useRouter } from "next/router";

export default function verifyEmail() {
  const { state, dispatch } = useContext(DataContext);
  const { auth } = state;
  const [error, setError] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const { token, email } = router.query;

    if (token && email) {
      verifyingEmail({ token, email });
    }
  }, [router.query, auth]);

  async function verifyingEmail({ token, email }) {
    const res = await postData("auth/verify-email", {
      verificationToken: token,
      email,
    });

    dispatch({ type: "NOTIFY", payload: { success: res.msg } });
    setError(false);

    if (res.err) {
      setError(true);
      return dispatch({ type: "NOTIFY", payload: { error: res.err } });
    }
  }

  return (
    <div className="row mx-auto">
      <div className=" w-100  table-responsive my-5 ">
        {Object.keys(router.query).length > 0 && !error && (
          <h2 className="text-uppercase alert-success px-3">
            Thank you! Your account has been verified correctly.
          </h2>
        )}
      </div>
      <Link href="/">
        <button type="button" className="btn btn-success w-100 text-uppercase">
          <a> enjoy shopping </a>
        </button>
      </Link>
    </div>
  );
}
