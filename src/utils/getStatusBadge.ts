const getStatusBadge = (status: string) => {
  switch (status) {
    case "backlog":
      return "bg-gray-100 text-gray-700";
    case "in-progress":
      return "bg-yellow-100 text-yellow-800";
    case "review":
      return "bg-purple-100 text-purple-800";
    case "done":
      return "bg-green-100 text-green-800";
    case "deployed":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-700";
  }
};
export default getStatusBadge;