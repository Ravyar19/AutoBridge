import { requireAuth } from "@/lib/auth-utils";
import { caller } from "@/trpc/server";
import { SignoutButton } from "@/components/signout-button";

const Page = async () => {
  await requireAuth();
  const data = await caller.getUsers();
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <SignoutButton />
      </div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default Page;
