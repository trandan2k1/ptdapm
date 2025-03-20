import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Bạn cần đăng nhập" });
  }

  console.log(session.user.role);
  const role = session.user.role ? JSON.parse(session.user.role) : null;
  if (!["AD", "DT"].includes(role.code)) {
    return res
      .status(403)
      .json({ error: "Bạn không có quyền thực hiện hành động này" });
  }

  try {
    if (req.method === "GET") {
        const examSessions = await prisma.examSession.findMany({
            select: {
              id: true,
              startTime: true,
              endTime: true,
              status: true,
              examRoom: {
                select: {
                  name: true, // Chỉ lấy tên phòng
                },
              },
              examSessionSubjectClasses: {
                select: {
                  subjectClass: {
                    select: {
                      subject: {
                        select: { name: true }, 
                      },
                      class: {
                        select: { name: true }, 
                      },
                    },
                  },
                },
              },
              students: {
                select: {
                  student: {
                    select: { name: true, id: true },
                  },
                },
              },
            },
          });

      return res.status(200).json(examSessions);
    } else {
      return res.status(405).json({ error: "Phương thức không được hỗ trợ" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
  }
}
