// TODO: Implement auth service using NextAuth or custom JWT

export async function getCurrentUser() {
  // const session = await getServerSession(authOptions);
  // return session?.user ?? null;
  return null;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}
