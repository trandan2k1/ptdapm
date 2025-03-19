import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]";
import prisma from "../../lib/prisma";

export default async function handler(req, res) {
  // Kiểm tra session và quyền admin
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Bạn cần đăng nhập" });
  }
  console.log(session);
  console.log(session.user);
  const role = JSON.parse(session.user.role);
  if (role.code !== "AD") {
    return res
      .status(403)
      .json({ error: "Bạn không có quyền thực hiện hành động này" });
  }
  const examSchedule = await prisma.examSchedule.findMany();

  res.status(200).json(examSchedule);
}
