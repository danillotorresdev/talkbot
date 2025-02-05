export async function fetchUsers(): Promise<string[]> {
  const response = await fetch("/api/admin/users");

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
}
