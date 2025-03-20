import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]";
import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  // Kiểm tra session và quyền admin
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

  const subjectClassList = await prisma.subjectClass.findMany({
    include: {
      subject: true,
      class: true, // Lấy thông tin class để có class.name
    },
  });
  
  // Nhóm dữ liệu theo tên lớp (class.name)
  const groupedData = Object.values(
    subjectClassList.reduce((acc, item) => {
      const className = item.class.name; // Lấy tên lớp
  
      if (!acc[className]) {
        acc[className] = {
          key: className, // Key cho bảng Ant Design
          name: className, // Chỉ hiển thị tên class
          children: [], // Danh sách subjectClass (con)
        };
      }
  
      acc[className].children.push({
        key: item.id, // Key cho từng subjectClass
        name: item.name, // Tên môn học
        subject: item.subject.name, // Tên subject
        classId: item.classId, // Giữ classId nếu cần
        className: item.class.name,
      });
  
      return acc;
    }, {})
  );
  
  res.status(200).json(groupedData);
  
}
