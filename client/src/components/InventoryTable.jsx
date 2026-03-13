import { NavLink } from "react-router-dom";
import StatusPill from "./StatusPill";

export default function InventoryTable({ products }) {
  return (
    <div style={containerStyle}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th scope="col" style={thStyle}>
              Item Name
            </th>
            <th scope="col" style={thStyle}>
              SKU
            </th>
            <th scope="col" style={thStyle}>
              Stock
            </th>
            <th scope="col" style={thStyle}>
              Price
            </th>
            <th scope="col" style={thStyle}>
              Status
            </th>
            <th scope="col" style={thStyle}></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            return (
              <tr key={product.id}>
                <td style={tdStyle}>{product.name}</td>
                <td style={tdStyle}>{product.skuOrBarcode || "N/A"}</td>
                <td style={tdStyle}>{product.onHand}</td>
                <td style={tdStyle}>{product.price}</td>
                <td style={tdStyle}>
                  <StatusPill
                    status={product.status}
                    onHand={product.onHand}
                    reorderLevel={product.reorderLevel}
                  />
                </td>
                <td style={actionTdStyle}>
                  <NavLink to={`${product.id}/edit`}>Edit</NavLink>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const containerStyle = {
  placeSelf: "center",
  marginTop: "20px",
  border: "1px solid #ccc",
  padding: "16px",
  borderRadius: "4px",
  width: "100%",
  boxSizing: "border-box",
  background: "#fff",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  fontFamily: "inherit",
};

const thStyle = {
  textAlign: "left",
  padding: "8px",
  borderBottom: "1px solid #eee",
  fontWeight: 600,
  verticalAlign: "top", 
};

const tdStyle = {
  textAlign: "left", 
  padding: "8px",
  borderBottom: "1px solid #f5f5f5",
  verticalAlign: "top", 
};

const actionTdStyle = {
  ...tdStyle,
  textAlign: "left", 
  width: "1%",
  whiteSpace: "nowrap",
};
