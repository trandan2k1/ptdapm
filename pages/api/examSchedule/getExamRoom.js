import prisma from "@/lib/prisma";

export default async function handler(req, res) {
    const examRoom = await prisma.examRoom.findMany();
    res.status(200).json(examRoom);
}
