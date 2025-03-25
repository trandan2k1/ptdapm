
//add user



import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]";
import prisma from "../../../lib/prisma";

export default async function handler(req, res) { 
      const session = await getServerSession(req, res, authOptions);
    
      if (!session) {
        return res.status(401).json({ error: "Bạn cần đăng nhập" });
      }
      console.log(session.user.role);
      
      const role = session.user.role ? JSON.parse(session.user.role) : null;
      if (!["AD", "DT"].includes(role.code)) {
        return res
          .status(403)
          .json({ error: "Bạn không có quyền thực hiện hành động này" });
      }
      const body = JSON.parse(req.body); 
      const { name, phone, username , roleId, password } = body;
        const user = await prisma.user.create({
          data: {
            name,
            phone,
            username,
            roleId,
            password
          },
        });
        res.status(200).json('Thêm người dùng thành công');
    }