export default function Product() {
  return;
}

export async function getStaticProps() {
  return {
    redirect: {
      destination: "/",
      permanent: true,
    },
  };
}
