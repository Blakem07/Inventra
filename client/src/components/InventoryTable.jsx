import { NavLink } from "react-router-dom";
import StatusPill from "./StatusPill";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function InventoryTable({ products }) {
  return (
    <div className="mt-5 w-full place-self-center rounded-md border border-border bg-background p-4">
      <Table className="text-left align-top">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left align-top">Item Name</TableHead>
            <TableHead className="text-left align-top">SKU</TableHead>
            <TableHead className="text-left align-top">Stock</TableHead>
            <TableHead className="text-left align-top">Price</TableHead>
            <TableHead className="text-left align-top">Status</TableHead>
            <TableHead className="text-left align-top"></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {products.map((product) => {
            return (
              <TableRow key={product.id} className="text-left align-top">
                <TableCell className="text-left align-top">{product.name}</TableCell>
                <TableCell className="text-left align-top">
                  {product.skuOrBarcode || "N/A"}
                </TableCell>
                <TableCell className="text-left align-top">{product.onHand}</TableCell>
                <TableCell className="text-left align-top">{product.price}</TableCell>
                <TableCell className="text-left align-top">
                  <StatusPill
                    status={product.status}
                    onHand={product.onHand}
                    reorderLevel={product.reorderLevel}
                  />
                </TableCell>
                <TableCell className="text-left align-top w-[1%] whitespace-nowrap">
                  <NavLink to={`${product.id}/edit`}>Edit</NavLink>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
