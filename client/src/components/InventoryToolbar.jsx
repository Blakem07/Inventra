import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function InventoryToolbar({ setSearchFilter, setCategoryFilter, categories }) {
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
            <SelectValue placeholder="All" />
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
