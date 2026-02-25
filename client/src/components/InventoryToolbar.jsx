export default function InventoryToolbar({ setSearchFilter, setCategoryFilter, categories }) {
  return (
    <div>
      <label htmlFor="inventory-search">Search:</label>
      <input
        type="search"
        id="inventory-search"
        name="search"
        onChange={(e) => {
          setSearchFilter(e.target.value);
        }}
      />
      <label htmlFor="category-select">Category:</label>

      <select
        name="categories"
        id="category-select"
        onChange={(e) => setCategoryFilter(e.target.value)}
      >
        <option value="all">All</option>
        {categories.map((category) => {
          return (
            <option value={category.id} key={category.id}>
              {category.name}
            </option>
          );
        })}
      </select>
    </div>
  );
}
