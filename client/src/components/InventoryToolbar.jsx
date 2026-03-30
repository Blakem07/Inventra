import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function InventoryToolbar({
  setSearchFilter,
  setCategoryFilter,
  categoryFilter,
  categories,
}) {
  return (
    <div className="flex items-end justify-center gap-4">
      <div>
        <label htmlFor="inventory-search">Search:</label>
        <Input
          type="search"
          id="inventory-search"
          name="search"
          onChange={(e) => {
            setSearchFilter(e.target.value);
          }}
        />
      </div>

      <div>
        <label htmlFor="category-select">Category:</label>
        <Select defaultValue="all" onValueChange={(value) => setCategoryFilter(value)}>
          <SelectTrigger id="category-select" className="w-[200px]">
            <SelectValue placeholder="All">
              {/* categoryFilter stores the selected category id;
                 find the matching category by id and display its name */}
              {categoryFilter === "all"
                ? "All"
                : categories.find((c) => String(c.id) === categoryFilter)?.name}
            </SelectValue>
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {categories.map((category) => {
              return (
                <SelectItem value={String(category.id)} key={category.id}>
                  {category.name}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
