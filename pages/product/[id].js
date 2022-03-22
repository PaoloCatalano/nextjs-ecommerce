import { useState, useContext } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import NoProduct from "../../components/NoProduct";
import { getData } from "../../utils/fetchData";
import { DataContext } from "../../store/GlobalState";
import { addToCart } from "../../store/Actions";
import { rgbDataURL } from "../../utils/blurData";
import { useProduct } from "../../utils/swr";

const DetailProduct = (props) => {
  //props.product === null
  if (Object.values(props).includes(null)) {
    return <NoProduct />;
  }

  const prodID = props.product._id;

  const [product] = useState(props.product);
  const [tab, setTab] = useState(0);

  const { state, dispatch } = useContext(DataContext);
  const { cart } = state;

  //SWR
  const { prodSWR, isLoading, isError } = useProduct(prodID);

  const isActive = (index) => {
    if (tab === index) return " active";
    return "";
  };

  return (
    <div className="row detail_page">
      <Head>
        <title>Detail Product</title>
      </Head>

      <div className="col-md-6 ">
        <div className="position-relative image-container">
          <Image
            className="d-block img-thumbnail rounded mt-4 w-100"
            src={product.images[tab].url}
            alt={product.images[tab].url}
            layout="fill"
            objectFit="contain"
            placeholder="blur"
            blurDataURL={rgbDataURL()}
            sizes="50vw"
            quality={100}
          />
        </div>

        <div className="row mx-0" style={{ cursor: "pointer" }}>
          {product.images.map((img, index) => (
            <Image
              key={index}
              src={img.url}
              alt={img.url}
              className={`img-thumbnail rounded mr-1 mt-1 ${isActive(index)}`}
              width={60}
              height={65}
              layout="fixed"
              onClick={() => setTab(index)}
            />
          ))}
        </div>
      </div>

      <div className="col-md-6 mt-3">
        <h2 className="text-uppercase">{product.title}</h2>
        <h5 className="text-danger">${product.price}</h5>

        <div className="row mx-0 d-flex justify-content-between">
          {prodSWR ? (
            prodSWR.product.inStock > 0 ? (
              <h6 className="text-danger">
                In Stock: {prodSWR.product.inStock}
              </h6>
            ) : (
              <h6 className="text-danger">Out Stock</h6>
            )
          ) : (
            <h6 className="text-danger">
              <span>{isLoading && "⌛"}</span>
              {isError && `maybe in Stock: ${product.inStock}`}
            </h6>
          )}

          {prodSWR ? (
            <h6 className="text-danger">Sold: {prodSWR.product.sold}</h6>
          ) : (
            <h6 className="text-danger">
              Sold {product.sold}?<span>{isLoading && "⌛"}</span>
            </h6>
          )}
        </div>

        <div className="my-2">{product.description}</div>
        <div className="my-2">{product.content}</div>

        {product.inStock <= 0 ? (
          <button
            type="button"
            className="btn btn-danger d-block my-3 px-5"
            disabled={true}
          >
            Sold Out
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-success d-block my-3 px-5"
            disabled={prodSWR?.product.inStock === 0 ? true : false}
            onClick={() => {
              dispatch({
                type: "NOTIFY",
                payload: { success: "Added to cart" },
              });

              return dispatch(addToCart(product, cart));
            }}
          >
            Add
          </button>
        )}
        <Link href="/cart">
          <button type="button" className="btn btn-dark d-block my-3 px-5">
            <a>Go to Cart</a>
          </button>
        </Link>
      </div>
    </div>
  );
};

export async function getServerSideProps({ params: { id } }) {
  const res = await getData(`product/${id}`);

  if (!res) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { product: res.product || null }, // will be passed to the page component as props
  };
}

export default DetailProduct;
