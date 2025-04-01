import prisma from "@/lib/prisma";

export default async function handler(req, res) {
    const body = JSON.parse(req.body);
    const { id, status } = body;
    const examSchedule = await prisma.examSession.update({
        where: { id },
        data: { status }
    });
    res.status(200).json(examSchedule);
}
