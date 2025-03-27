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

    const conflictingSession = await prisma.examSession.findFirst({
        where: {
            examRoomId,
            OR: [
                {
                    AND: [
                        { startTime: { lte: endTime } },
                        { endTime: { gte: startTime } } 
                    ]
                }
            ]
        }
    });

    if (conflictingSession) {
        return res.status(400).json({ error: "Thời gian đã bị trùng với một lịch thi khác trong cùng phòng thi" });
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
    });

    return res.status(200).json({ message: "Thêm lịch thi thành công", examSchedule });
}
