import { useState, useContext, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import PleaseSign from "../components/PleaseSign";
import { DataContext } from "../store/GlobalState";
import valid, { validateNumber } from "../utils/valid";
import { patchData } from "../utils/fetchData";
import { rgbDataURL } from "../utils/blurData";
import { imageUpload } from "../utils/imageUpload";
import { FiCamera } from "react-icons/fi";
import { FaTimes, FaCheck } from "react-icons/fa";
// import { useUser } from "../utils/swr";

const Profile = () => {
  const initialSate = {
    avatar: "",
    name: "",
    password: "",
    cf_password: "",
    address: "",
    mobile: "",
  };
  const [data, setData] = useState(initialSate);
  const [isNumb, setIsNumb] = useState(true);
  const { avatar, name, password, cf_password, address, mobile } = data;

  const { state, dispatch } = useContext(DataContext);
  const { auth, notify, orders } = state;

  //SWR
  // const { userSWR, isLoading, isError } = useUser(auth.token);

  useEffect(() => {
    if (auth.user)
      setData({
        ...data,
        name: auth.user.name,
        address: auth.user.address,
        mobile: auth.user.mobile,
      });
  }, [auth.user]);

  const handleNumber = (e) => {
    const { value } = e.target;
    if (value === "") {
      setIsNumb(true);
    } else {
      setIsNumb(validateNumber(value));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData({ ...data, [name]: value });
    dispatch({ type: "NOTIFY", payload: {} });
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();

    if (password) {
      const errMsg = valid(name, auth.user.email, password, cf_password);
      if (errMsg)
        return dispatch({ type: "NOTIFY", payload: { error: errMsg } });
      updatePassword();
    } else if (name.length < 3) {
      dispatch({
        type: "NOTIFY",
        payload: { error: "Name must be at least 3 characters." },
      });
    } else if (
      name === "" ||
      name === " " ||
      name === "  " ||
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
      updateInfor();
    }
  };

  const updatePassword = () => {
    dispatch({ type: "NOTIFY", payload: { loading: true } });
    patchData("user/resetPassword", { password }, auth.token).then((res) => {
      if (res.err)
        return dispatch({ type: "NOTIFY", payload: { error: res.err } });
      return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
    });
  };

  const changeAvatar = (e) => {
    const file = e.target.files[0];
    if (!file)
      return dispatch({
        type: "NOTIFY",
        payload: { error: "File does not exist." },
      });

    if (file.size > 1024 * 1024)
      //1mb
      return dispatch({
        type: "NOTIFY",
        payload: { error: "The largest image size is 1mb." },
      });

    if (file.type !== "image/jpeg" && file.type !== "image/png")
      //1mb
      return dispatch({
        type: "NOTIFY",
        payload: { error: "Image format is incorrect." },
      });

    setData({ ...data, avatar: file });
  };

  const updateInfor = async () => {
    let media;
    dispatch({ type: "NOTIFY", payload: { loading: true } });

    if (avatar) media = await imageUpload([avatar]);

    patchData(
      "user",
      {
        name,
        address,
        mobile,
        avatar: avatar ? media[0].url : auth.user.avatar,
      },
      auth.token
    ).then((res) => {
      if (res.err)
        return dispatch({ type: "NOTIFY", payload: { error: res.err } });

      dispatch({
        type: "AUTH",
        payload: {
          token: auth.token,
          user: res.user,
        },
      });
      return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
    });
  };

  if (!auth.user) return null;

  return (
    <div className="profile_page">
      <Head>
        <title>Profile</title>
      </Head>
      {!auth.user.isVerified && (
        <div className="my-3 w-100vw alert alert-danger" role="alert">
          <center>
            <h4>Please Verify your email!</h4>
          </center>
        </div>
      )}
      {/* // using SWR */}
      {/* {auth.user.isVerified === false ? (
        <div className="my-3 w-100vw alert alert-danger" role="alert">
          <center>
            <h4>Please Verify your email!</h4>
          </center>
        </div>
      ) : userSWR && userSWR.user && !userSWR.user.isVerified ? (
        <div className="my-3 w-100vw alert alert-danger" role="alert">
          <center>
            <h4>Please Verify your email!</h4>
          </center>
        </div>
      ) : (
        (isLoading || isError) &&
        !auth.user.isVerified && (
          <div className="my-3 w-100vw alert alert-danger" role="alert">
            <center>
              <h4>Please Verify your email!</h4>
            </center>
          </div>
        )
      )} */}
      <section className="row text-secondary my-3">
        <div className="col-md-4">
          <h3 className="text-center text-uppercase">
            {auth.user.role === "user" ? "User Profile" : "Admin Profile"}
          </h3>

          <div className="avatar">
            <Image
              src={avatar ? URL.createObjectURL(avatar) : auth.user.avatar}
              alt="avatar"
              layout="fill"
              placeholder="blur"
              blurDataURL={rgbDataURL()}
            />
            <span>
              <FiCamera />
              <p>Change</p>
              <input
                type="file"
                name="file"
                id="file_up"
                accept="image/*"
                onChange={changeAvatar}
              />
            </span>
          </div>

          <div className="form-group">
            <label htmlFor="name">
              Name{" "}
              {!name && (
                <span className="text-danger"> 😱 Cannot be empty!</span>
              )}
            </label>
            <input
              type="text"
              name="name"
              value={name}
              maxLength={20}
              minLength={3}
              className={`form-control ${!name && "is-invalid"}`}
              placeholder="Your name"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              name="email"
              defaultValue={auth.user.email}
              className="form-control"
              disabled={true}
            />
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
              name="mobile"
              defaultValue={auth.user.mobile}
              className={`form-control ${!isNumb && "is-invalid"}`}
              placeholder="Your mobile"
              maxLength={15}
              onChange={handleChange}
              onInput={handleNumber}
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              name="address"
              defaultValue={auth.user.address}
              className="form-control"
              placeholder="Your address"
              maxLength={100}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              name="password"
              value={password}
              minLength={6}
              className="form-control"
              placeholder="Your new password"
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="cf_password">Confirm New Password</label>
            <input
              type="password"
              name="cf_password"
              value={cf_password}
              className={`form-control ${
                cf_password !== ""
                  ? password === cf_password
                    ? "is-valid"
                    : "is-invalid"
                  : ""
              }`}
              placeholder="Confirm new password"
              onChange={handleChange}
            />
          </div>

          <button
            className="btn btn-info"
            disabled={notify.loading}
            onClick={handleUpdateProfile}
          >
            Update
          </button>
        </div>

        <div className="col-md-8">
          <h3 className="text-uppercase">Orders</h3>

          <div className="my-3 table-responsive">
            <table
              className="table-bordered table-hover w-100 text-uppercase"
              style={{ minWidth: "600px", cursor: "pointer" }}
            >
              <thead className="bg-light font-weight-bold">
                <tr>
                  <td className="p-2">id</td>
                  {auth.user.root && <td className="p-2">user email</td>}
                  <td className="p-2">date</td>
                  <td className="p-2">total</td>
                  <td className="p-2">delivered</td>
                  <td className="p-2">paid</td>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="p-2">
                      <Link href={`/order/${order._id}`}>
                        <a>{order._id.slice(0, 9)}...</a>
                      </Link>
                    </td>
                    {auth.user.root && (
                      <td className="p-2">
                        {order?.user?._id ? (
                          <Link href={`/edit_user/${order.user._id}`}>
                            <a className="text-lowercase">{order.user.email}</a>
                          </Link>
                        ) : (
                          <div className="text-danger">USER DELETED</div>
                        )}
                      </td>
                    )}
                    <td className="p-2">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-2">${order.total}</td>
                    <td className="p-2">
                      {order.delivered ? (
                        <FaCheck className="text-success"></FaCheck>
                      ) : (
                        <FaTimes className="text-danger"></FaTimes>
                      )}
                    </td>
                    <td className="p-2">
                      {order.paid ? (
                        <FaCheck className="text-success"></FaCheck>
                      ) : (
                        <FaTimes className="text-danger"></FaTimes>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;
