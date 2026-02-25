import { NavLink } from "react-router-dom";
import StatusPill from "./StatusPill";

export default function InventoryTable({ products }) {
  return (
    <table>
      <thead>
        <tr>
          <th scope="col">Item Name</th>
          <th scope="col">SKU</th>
          <th scope="col">Stock</th>
          <th scope="col">Price</th>
          <th scope="col">Status</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => {
          return (
            <tr key={product.id}>
              <th scope="row">{product.name}</th>
              <td>{product.skuOrBarcode || "N/A"}</td>
              <td>{product.onHand}</td>
              <td>{product.price}</td>
              <td>
                <StatusPill
                  status={product.status}
                  onHand={product.onHand}
                  reorderLevel={product.reorderLevel}
                />
              </td>
              <td>
                <NavLink to={`${product.id}/edit`}>Edit</NavLink>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
