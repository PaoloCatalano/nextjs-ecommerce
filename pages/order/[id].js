import Head from "next/head";
import { useState, useContext, useEffect } from "react";
import { DataContext } from "../../store/GlobalState";
import { useRouter } from "next/router";
import GoBack from "../../components/GoBack";
import OrderDetail from "../../components/OrderDetail";
import PleaseSign from "../../components/PleaseSign";

const DetailOrder = () => {
  const { state, dispatch } = useContext(DataContext);
  const { orders, auth } = state;

  const router = useRouter();

  const [orderDetail, setOrderDetail] = useState([]);

  useEffect(() => {
    const newArr = orders.filter((order) => order._id === router.query.id);
    setOrderDetail(newArr);
  }, [orders]);

  if (!auth.user) return <PleaseSign />;

  return (
    <div className="my-3">
      <Head>
        <title>Detail Orders</title>
      </Head>

      <GoBack />

      <OrderDetail
        orderDetail={orderDetail}
        state={state}
        dispatch={dispatch}
      />
    </div>
  );
};

export default DetailOrder;
