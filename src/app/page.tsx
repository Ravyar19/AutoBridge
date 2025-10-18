import { Button } from "@/components/ui/button";
import prisma from "@/lib/db";

const Page = async () => {
  const users = await prisma.user.findMany();
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello World</h1>
      <Button>Click me</Button>
      {JSON.stringify(users)}
    </div>
  );
};

export default Page;
