export default function SalesTable(props) {
  const rows = props.rows || [];

  return (
    <div style={containerStyle}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th scope="col" style={thStyle}>
              Date
            </th>
            <th scope="col" style={thStyle}>
              Payment Method
            </th>
            <th scope="col" style={thStyle}>
              Amount
            </th>
            <th scope="col" style={thStyle}>
              Staff
            </th>
          </tr>
        </thead>

        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ textAlign: "center", padding: "16px" }}>
                No data
              </td>
            </tr>
          ) : (
            rows.map(function (row) {
              return (
                <tr key={row.saleId}>
                  <td style={tdStyle}>{row.occurredAt.slice(0, 10)}</td>
                  <td style={tdStyle}>{row.paymentMethod}</td>
                  <td style={tdStyle}>{row.totalAmount}</td>
                  <td style={tdStyle}>{row.performedBy}</td>
                </tr>
              );
            })
          )}
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
