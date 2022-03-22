import Head from "next/head";
import Link from "next/link";
import { useState, useContext, useEffect } from "react";
import valid, { validateNumber } from "../utils/valid";
import { DataContext } from "../store/GlobalState";
import { postData } from "../utils/fetchData";
import { useRouter } from "next/router";

const Register = () => {
  const initialState = {
    name: "",
    email: "",
    password: "",
    cf_password: "",
    address: "",
    mobile: "",
  };
  const [userData, setUserData] = useState(initialState);
  const [isNumb, setIsNumb] = useState(true);

  const { name, email, password, cf_password, address, mobile } = userData;

  const { state, dispatch } = useContext(DataContext);
  const { auth } = state;

  const router = useRouter();

  const handleNumber = (e) => {
    const { value } = e.target;
    if (value === "") {
      setIsNumb(true);
    } else {
      setIsNumb(validateNumber(value));
    }
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    dispatch({ type: "NOTIFY", payload: {} });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errMsg = valid(name, email, password, cf_password);

    if (errMsg) return dispatch({ type: "NOTIFY", payload: { error: errMsg } });

    if (name.length < 3) {
      dispatch({
        type: "NOTIFY",
        payload: { error: "Name must be at least 3 characters." },
      });
    } else if (
      name === "" ||
      name === "   " ||
      name === "    " ||
      name === "     " ||
      name === "      " ||
      name === "       " ||
      name === "        " ||
      name === "         " ||
      name === "          " ||
      name === "           " ||
      name === "            " ||
      name === "             " ||
      name === "              " ||
      name === "               " ||
      name === "                " ||
      name === "                 " ||
      name === "                  " ||
      name === "                   " ||
      name === "                    "
    ) {
      dispatch({
        type: "NOTIFY",
        payload: { error: "Name cannot be empty." },
      });
    } else if (address?.length > 100) {
      dispatch({
        type: "NOTIFY",
        payload: { error: "Address must be less than 100 characters." },
      });
    } else if (mobile?.length > 15) {
      dispatch({
        type: "NOTIFY",
        payload: { error: "Mobile number must be less than 15 digits." },
      });
    } else {
      dispatch({ type: "NOTIFY", payload: { loading: true } });

      const res = await postData("auth/register", userData);

      if (res.err)
        return dispatch({ type: "NOTIFY", payload: { error: res.err } });

      return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
    }
  };

  useEffect(() => {
    if (Object.keys(auth).length !== 0) router.push("/");
  }, [auth]);

  return (
    <div>
      <Head>
        <title>Register Page</title>
      </Head>

      <form
        className="mx-auto my-4"
        style={{ maxWidth: "500px" }}
        onSubmit={handleSubmit}
      >
        <div className="form-group">
          <label htmlFor="name">
            Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            aria-describedby="name"
            maxLength={20}
            minLength={3}
            name="name"
            value={name}
            onChange={handleChangeInput}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="exampleInputEmail1">
            Email address <span className="text-danger">*</span>
          </label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            name="email"
            value={email}
            onChange={handleChangeInput}
            required
          />
          <small id="emailHelp" className="form-text text-muted">
            We'll never share your email with anyone else.
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="address">Shipping Address</label>
          <input
            type="text"
            className="form-control"
            id="address"
            aria-describedby="address"
            name="address"
            value={address}
            onChange={handleChangeInput}
            maxLength={100}
          />
          <small id="address" className="form-text text-muted">
            We'll never share your address with anyone else.
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="mobile">
            Mobile{" "}
            {!isNumb && (
              <span className="text-danger"> 😱 Must be a number!</span>
            )}
          </label>
          <input
            type="text"
            className={`form-control ${!isNumb && "is-invalid"}`}
            id="mobile"
            aria-describedby="mobile"
            name="mobile"
            value={mobile}
            onChange={handleChangeInput}
            maxLength={15}
            onInput={handleNumber}
          />
          <small id="mobile" className="form-text text-muted">
            We'll never share your mobile with anyone else.
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="exampleInputPassword1">
            Password <span className="text-danger">*</span>
          </label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            name="password"
            value={password}
            onChange={handleChangeInput}
            required
            minLength={6}
          />
        </div>

        <div className="form-group">
          <label htmlFor="exampleInputPassword2">
            Confirm Password <span className="text-danger">*</span>
          </label>
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

        <p>
          <small className="text-danger">* Mandatory field</small>
        </p>

        <button type="submit" className="btn btn-dark w-100">
          Register
        </button>

        <p className="my-2">
          Already have an account?{" "}
          <Link href="/signin">
            <a style={{ color: "crimson" }}>Login Now</a>
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
