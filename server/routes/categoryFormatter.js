export function formatCategory(category) {
  const c =
    typeof category?.toObject === "function"
      ? category.toObject()
      : category;

  return {
    id: String(c._id),
    name: c.name,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  };
}