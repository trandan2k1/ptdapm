import prisma from "@/lib/prisma";

export default async function handler(req, res) {
    const body = JSON.parse(req.body);
    const { id, invigilatorId, role } = body;
    const session = await prisma.examSession.findUnique({
        where: {
            id
        }
    })
    if (!session) {
        return res.status(404).json({ error: 'Lịch thi không tồn tại' })
    }
    const examSchedule = await prisma.examSessionInvigilator.create({
        data: {
            examSessionId: id,
            invigilatorId,
            role
        }
    })
    res.status(200).json(examSchedule)
}

