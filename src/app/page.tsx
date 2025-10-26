import { requireAuth } from "@/lib/auth-utils";
import { caller } from "@/trpc/server";
const Page = async () => {
  await requireAuth();
  const data = await caller.getUsers();
  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default Page;
