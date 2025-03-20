
import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
    const { name , roleId } = req.query;
    const student = await prisma.user.findMany({
        where: {
            roleId: Number(roleId),
            name: {
                contains: name,
            },
        },
    });
    return res.status(200).json(student);
}

