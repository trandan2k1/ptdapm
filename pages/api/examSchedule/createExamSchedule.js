// model ExamSession {
//     id             Int      @id @default(autoincrement())
//     examRoomId     Int
//     startTime      DateTime // Giờ bắt đầu thi
//     endTime        DateTime? // Giờ kết thúc thi (nếu có)
//     status         String   // "pending", "ongoing", "completed"

//     examRoom     ExamRoom     @relation(fields: [examRoomId], references: [id])

//     // Mỗi phiên thi có thể gắn với nhiều môn học - lớp
//     examSessionSubjectClasses ExamSessionSubjectClass[]

//     // Quan hệ với các bảng ghi nhận sinh viên và giảng viên tham gia
//     students    ExamSessionStudent[]
//     invigilators ExamSessionInvigilator[]
//     ExamResult  ExamResult[]
//   }

import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
        return res.status(401).json({ error: "Bạn cần đăng nhập" });
    }


    const role = session.user.role ? JSON.parse(session.user.role) : null;
    if (!["AD", "DT"].includes(role.code)) {
        return res.status(403).json({ error: "Bạn không có quyền thực hiện hành động này" });
    }

    const body = JSON.parse(req.body); 
    console.log("Parsed body:", body);

    const { startTime, endTime, examRoomId, subjectClassId } = body;

    if (!startTime || !endTime || !examRoomId || !subjectClassId) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const examSchedule = await prisma.examSession.create({
        data: {
            startTime,
            endTime,
            examRoomId,
            examSessionSubjectClasses: {
                create: {
                    subjectClassId
                }
            },
            status: "pending"
        }
    })

    return res.status(200).json({ message: "Thêm lịch thi thành công", examSchedule });
}
