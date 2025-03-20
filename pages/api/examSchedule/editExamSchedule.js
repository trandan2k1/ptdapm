import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "../../../lib/prisma";

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

export default async function handler(req, res) {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
        return res.status(401).json({ error: "Bạn cần đăng nhập" });
    }


    const role = session.user.role ? JSON.parse(session.user.role) : null;
    if (!["AD", "DT"].includes(role.code)) {
        return res.status(403).json({ error: "Bạn không có quyền thực hiện hành động này" });
    }

    const { id, startTime, endTime, examRoomId, subjectClassId, studentIds, invigilatorIds } = req.body;

    const examSchedule = await prisma.examSession.update({
        where: { id },
        data: { startTime, endTime, examRoomId, examSessionSubjectClasses: {
            update: {
                subjectClassId
            }
        },
        students: {
            create: studentIds.map(studentId => ({
                studentId
            }))
        },
        invigilators: {
            create: invigilatorIds.map(invigilatorId => ({
                invigilatorId
            }))
            }
        }
    });

    return res.status(200).json({ message: "Cập nhật lịch thi thành công", examSchedule });

}
