import { useRouter } from "next/router";

export default function GoBack() {
  const router = useRouter();
  return (
    <div className="my-2">
      <button className="btn btn-dark" onClick={() => router.back()}>
        <i className="fas fa-long-arrow-alt-left" aria-hidden></i> Go Back
      </button>
    </div>
  );
}
