export const getColor = (status: string) => {
  if (status === "To Do") return "badge-gray";
  if (status === "In Progress") return "badge-blue";
  if (status === "Completed") return "badge-green";
  if (status === "Cancelled") return "badge-red";
  return "badge-gray";
};

export const getColorPriority = (priority: string) => {
  if (priority === "High") return "badge-red";
  if (priority === "Medium") return "badge-yellow";
  if (priority === "Low") return "badge-green";
  return "badge-gray";
};

export const tagsClass = ["violet-tag", "blue-tag", "pink-tag", "orange-tag"];
