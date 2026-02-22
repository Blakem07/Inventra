import QuickActions from "../components/QuickActions";

export default function InventoryPage() {
  return (
    <div data-testid="inventory-page">
      <h1>Inventory Page</h1>
      <QuickActions actions={[{ label: "Add Item", path: "new" }]} />
    </div>
  );
}
