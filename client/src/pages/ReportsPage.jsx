import { useState, useEffect } from "react";
import { getDateRange } from "../utils/getDateRange";
import { listSalesReport, listMovementsReport } from "../api/reports";

import MovementsTable from "../components/MovementsTable";
import SalesTable from "../components/SalesTable";

import PageHeader from "@/components/PageHeader";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  const [rangeType, setRangeType] = useState("last7");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [activeTab, setActiveTab] = useState("sales");
  const [salesReport, setSalesReport] = useState({ sales: [] });
  const [movementsReport, setMovementsReport] = useState({ movements: [] });

  const rangeLabels = {
    today: "Today",
    last7: "Last 7 Days",
    last30: "Last 30 Days",
    thisMonth: "This Month",
    lastMonth: "Last Month",
  };

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
    <div data-testid="reports-page" className="space-y-4">
      <PageHeader
        badge="Reports"
        title="Reports"
        description="View sales and stock movement reports for selected date ranges."
        testId="reports-page-heading"
      />

      {loading && (
        <span role="alert" data-testid="reports-loading">
          Loading...
        </span>
      )}

      {fetchError && (
        <span role="alert" data-testid="reports-error">
          Error: Fetching Reports
        </span>
      )}

      <section aria-labelledby="reports-section">
        <Card className="shadow-md">
          <CardHeader>
            <h2
              id="reports-section"
              data-testid="reports-section-heading"
              className="text-2xl font-semibold leading-none tracking-tight"
            >
              Report Viewer
            </h2>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <label htmlFor="rangeType" className="text-sm font-medium">
                  Date Range:
                </label>

                <Select value={rangeType} onValueChange={setRangeType}>
                  <SelectTrigger id="rangeType" className="w-[180px]">
                    <SelectValue>{rangeLabels[rangeType]}</SelectValue>
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="last7">Last 7 Days</SelectItem>
                    <SelectItem value="last30">Last 30 Days</SelectItem>
                    <SelectItem value="thisMonth">This Month</SelectItem>
                    <SelectItem value="lastMonth">Last Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <span className="text-sm text-muted-foreground">From: {from}</span>
              <span className="text-sm text-muted-foreground">To: {to}</span>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant={activeTab === "sales" ? "default" : "outline"}
                onClick={() => setActiveTab("sales")}
              >
                Sales
              </Button>

              <Button
                type="button"
                variant={activeTab === "movements" ? "default" : "outline"}
                onClick={() => setActiveTab("movements")}
              >
                Movements
              </Button>
            </div>

            {!loading &&
              !fetchError &&
              (activeTab === "sales" ? (
                <SalesTable rows={salesReport.sales} />
              ) : (
                <MovementsTable rows={movementsReport.movements} />
              ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
