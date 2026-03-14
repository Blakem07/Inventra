import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function MovementsTable(props) {
  const rows = props.rows || [];

  return (
    <div className="mt-5 w-full place-self-center rounded-md border border-border bg-background p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left align-top">Date</TableHead>
            <TableHead className="text-left align-top">Item</TableHead>
            <TableHead className="text-left align-top">Change</TableHead>
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
                <TableRow key={row.movementId}>
                  <TableCell className="text-left align-top">
                    {row.occurredAt.slice(0, 10)}
                  </TableCell>
                  <TableCell className="text-left align-top">{row.product.name}</TableCell>
                  <TableCell className="text-left align-top">{row.quantity}</TableCell>
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
