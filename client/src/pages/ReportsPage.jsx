import { useState, useEffect } from "react";
import { getDateRange } from "../utils/getDateRange";
import { listSalesReport, listMovementsReport } from "../api/reports";

import MovementsTable from "../components/MovementsTable";
import SalesTable from "../components/SalesTable";

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  const [rangeType, setRangeType] = useState("last7");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [activeTab, setActiveTab] = useState("sales");
  const [salesReport, setSalesReport] = useState({ sales: [] });
  const [movementsReport, setMovementsReport] = useState({ movements: [] });

  useEffect(() => {
    const range = getDateRange(rangeType);

    setFrom(range.from);
    setTo(range.to);

    async function load() {
      setFetchError(false);
      setLoading(true);

      try {
        const salesReportData = await listSalesReport({
          from: range.from,
          to: range.to,
        });

        const movementsReportData = await listMovementsReport({
          from: range.from,
          to: range.to,
        });

        if (
          !salesReportData ||
          typeof salesReportData !== "object" ||
          Array.isArray(salesReportData) ||
          !Array.isArray(salesReportData.sales)
        ) {
          throw new Error("Invalid Sales Data Shape");
        }

        if (
          !movementsReportData ||
          typeof movementsReportData !== "object" ||
          Array.isArray(movementsReportData) ||
          !Array.isArray(movementsReportData.movements)
        ) {
          throw new Error("Invalid Movements Data Shape");
        }

        setSalesReport(salesReportData);
        setMovementsReport(movementsReportData);
      } catch {
        setFetchError(true);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [rangeType]);

  return (
    <div data-testid="reports-page" style={{ display: "flex", flexDirection: "column" }}>
      <h1>Reports Page</h1>

      {loading && <div data-testid="loading">Loading...</div>}
      {fetchError && <div data-testid="error">Error: Fetching Reports</div>}

      <section
        style={{
          border: "1px solid #ccc",
          padding: "16px",
          marginBottom: "16px",
          borderRadius: "4px",
        }}
      >
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px", alignItems: "center" }}>
          <label htmlFor="rangeType">Date Range:</label>
          <select id="rangeType" value={rangeType} onChange={(e) => setRangeType(e.target.value)}>
            <option value="today">Today</option>
            <option value="last7">Last 7 Days</option>
            <option value="last30">Last 30 Days</option>
            <option value="thisMonth">This Month</option>
            <option value="lastMonth">Last Month</option>
          </select>

          <span>From: {from}</span>
          <span>To: {to}</span>
        </div>

        <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
          <button type="button" onClick={() => setActiveTab("sales")}>
            Sales
          </button>
          <button type="button" onClick={() => setActiveTab("movements")}>
            Movements
          </button>
        </div>

        {!loading &&
          !fetchError &&
          (activeTab === "sales" ? (
            <SalesTable rows={salesReport.sales} />
          ) : (
            <MovementsTable rows={movementsReport.movements} />
          ))}
      </section>
    </div>
  );
}
