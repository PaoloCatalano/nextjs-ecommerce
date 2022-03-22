import Head from "next/head";
import { useContext } from "react";
import { DataContext } from "../store/GlobalState";
import Link from "next/link";
import Image from "next/image";
import PleaseSign from "../components/PleaseSign";
import GoBack from "../components/GoBack";

const Users = () => {
  const { state, dispatch } = useContext(DataContext);
  const { users, auth, modal } = state;

  if (!auth.user || auth.user.role !== "admin") return <PleaseSign />;
  return (
    <div className="table-responsive">
      <Head>
        <title>Users</title>
      </Head>
      <GoBack />
      <table className="table w-100">
        <thead>
          <tr>
            <th></th>
            <th>ID</th>
            <th>Avatar</th>
            <th>Name</th>
            <th>Email</th>
            <th>Admin</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user, index) => (
            <tr key={user._id}>
              <th>{index + 1}</th>
              <th>{user._id}</th>
              <th>
                <Image
                  src={user.avatar}
                  alt={user.avatar}
                  layout="fixed"
                  width={30}
                  height={30}
                  className="overflow-hidden rounded-circle"
                />
              </th>
              <th>{user.name}</th>
              <th>{user.email}</th>
              <th>
                {user.role === "admin" ? (
                  user.root ? (
                    <i className="fas fa-check text-success"> Root</i>
                  ) : (
                    <i className="fas fa-check text-success"></i>
                  )
                ) : (
                  <i className="fas fa-times text-danger"></i>
                )}
              </th>
              <th>
                <Link
                  href={
                    auth.user.root && auth.user.email !== user.email
                      ? `/edit_user/${user._id}`
                      : "#!"
                  }
                >
                  <a>
                    <i className="fas fa-edit text-info mr-2" title="Edit"></i>
                  </a>
                </Link>

                {auth.user.root && auth.user.email !== user.email ? (
                  <i
                    style={{ cursor: "pointer" }}
                    className="fas fa-trash-alt text-danger ml-2"
                    title="Remove"
                    data-toggle="modal"
                    data-target="#exampleModal"
                    onClick={() =>
                      dispatch({
                        type: "ADD_MODAL",
                        payload: [
                          {
                            data: users,
                            id: user._id,
                            title: user.name,
                            type: "ADD_USERS",
                          },
                        ],
                      })
                    }
                  ></i>
                ) : (
                  <i
                    className="fas fa-trash-alt text-danger ml-2"
                    title="Can't Remove"
                    style={{ cursor: "not-allowed" }}
                  ></i>
                )}
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
