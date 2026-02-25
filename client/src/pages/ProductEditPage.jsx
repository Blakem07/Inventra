import { useParams } from "react-router-dom";

export default function ProductEditPage() {
  const { id } = useParams();

  return (
    <div data-testid="product-edit-page">
      <h1>Product Edit Page</h1>
      <h3>
        Currently Editing: <span>{id}</span>
      </h3>
    </div>
  );
}
