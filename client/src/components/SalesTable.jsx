import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/**
 * Renders a table of sales records.
 *
 * @param {Object} props
 * @param {Array<{
 *   saleId: string|number,
 *   occurredAt: string,
 *   paymentMethod: string,
 *   totalAmount: number|string,
 *   performedBy: string
 * }>} [props.rows]
 * @returns {JSX.Element}
 */
export default function SalesTable(props) {
  const rows = props.rows || [];

  return (
    <div className="mt-5 w-full place-self-center rounded-md border border-border bg-background p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left align-top">Date</TableHead>
            <TableHead className="text-left align-top">Payment Method</TableHead>
            <TableHead className="text-left align-top">Amount</TableHead>
            <TableHead className="text-left align-top">Staff</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="py-4 text-center">
                No data
              </TableCell>
            </TableRow>
          ) : (
            rows.map(function (row) {
              return (
                <TableRow key={row.saleId}>
                  <TableCell className="text-left align-top">
                    {row.occurredAt.slice(0, 10)}
                  </TableCell>
                  <TableCell className="text-left align-top">{row.paymentMethod}</TableCell>
                  <TableCell className="text-left align-top">{row.totalAmount}</TableCell>
                  <TableCell className="text-left align-top">{row.performedBy}</TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
