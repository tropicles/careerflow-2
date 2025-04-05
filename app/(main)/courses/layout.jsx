import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function CoursesLayout({ children }) {
  const { userId } = await auth();
  


  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      industryInsight: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // If the user's industry is not set, redirect to the /onboarding page.
  if (!user.industry) {
    redirect("/onboarding");
  }

  return children;
}