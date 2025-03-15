import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"

export default async function handler(req, res) {
    // Kiểm tra session và quyền admin
    const session = await getServerSession(req, res, authOptions)
    
    if (!session) {
        return res.status(401).json({ error: "Bạn cần đăng nhập" })
    }
    
    if (session.user.role !== "admin") {
        return res.status(403).json({ error: "Bạn không có quyền thực hiện hành động này" })
    }

    // Xử lý tạo lịch thi nếu có quyền admin
    const { subjectCode, subjectName, examDate } = req.body
    const examSchedule = await prisma.examSchedule.create({
        data: {
            subjectCode,
            subjectName,
            examDate
        }
    })
    res.status(200).json(examSchedule)
}