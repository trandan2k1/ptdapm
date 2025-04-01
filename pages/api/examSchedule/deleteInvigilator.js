import prisma from "@/lib/prisma";

export default async function handler(req, res) {
    const body = JSON.parse(req.body);
    const { id } = body;
    console.log("fasfsakjbgfsakhjasfkhjlfklsa", id);
    
    const examSchedule = await prisma.examSessionInvigilator.delete({
        where: { id }
    });
    res.status(200).json(examSchedule);
}
