
import prisma from "../../../lib/prisma";


export default async function handler(req, res) {
  const subjects = await prisma.subject.findMany();
  res.status(200).json(subjects);
}