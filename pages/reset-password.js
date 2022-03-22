import { useState, useContext, useEffect } from "react";
import Head from "next/head";
import { DataContext } from "../store/GlobalState";
import { postData } from "../utils/fetchData";
import { useRouter } from "next/router";

const Signin = () => {
  const initialState = { password: "", cf_password: "" };
  const [userData, setUserData] = useState(initialState);
  const { password, cf_password } = userData;

  const { state, dispatch } = useContext(DataContext);
  const { auth } = state;

  const router = useRouter();

  const { token, email } = router.query;

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    dispatch({ type: "NOTIFY", payload: {} });
  };

  const valid = () => {
    if (!password) return "Please add new password.";

    if (password.length < 6) return "Password must be at least 6 characters.";

    if (password !== cf_password) return "Confirm password did not match.";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errMsg = valid(password, cf_password);

    if (errMsg) return dispatch({ type: "NOTIFY", payload: { error: errMsg } });
    dispatch({ type: "NOTIFY", payload: { loading: true } });
    const res = await postData("resetPassword/reset-password", {
      password,
      token,
      email,
    });

    if (res.err)
      return dispatch({ type: "NOTIFY", payload: { error: res.err } });

    dispatch({ type: "NOTIFY", payload: { success: res.msg } });

    // dispatch({
    //   type: "AUTH",
    //   payload: {
    //     token: res.access_token,
    //     user: res.user,
    //   },
    // });
  };

  return (
    <div>
      <Head>
        <title>Reset password in Page</title>
      </Head>

      <form
        className="mx-auto my-4"
        style={{ maxWidth: "500px" }}
        onSubmit={handleSubmit}
      >
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            required
            name="password"
            value={password}
            onChange={handleChangeInput}
            required
            minLength={6}
          />
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword2">Confirm Password</label>
          <input
            type="password"
            className={`form-control ${
              cf_password !== ""
                ? password === cf_password
                  ? "is-valid"
                  : "is-invalid"
                : ""
            }`}
            id="exampleInputPassword2"
            name="cf_password"
            value={cf_password}
            onChange={handleChangeInput}
            required
          />
        </div>
        <button type="submit" className="btn btn-dark w-100">
          Submit New Password
        </button>
      </form>
    </div>
  );
};

export default Signin;
