import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const NUM_STUDENTS = 20;

async function main() {
  console.log("🌱 Bắt đầu seeding dữ liệu...");

  // Xóa toàn bộ dữ liệu cũ theo thứ tự phụ thuộc
  await prisma.examResult.deleteMany();
  await prisma.userSession.deleteMany();
  await prisma.personalInfo.deleteMany();
  await prisma.examSessionStudent.deleteMany();
  await prisma.examSessionInvigilator.deleteMany();
  await prisma.examSessionSubjectClass.deleteMany();
  await prisma.examSession.deleteMany();
  await prisma.examRoom.deleteMany();
  await prisma.subjectClass.deleteMany();
  await prisma.class.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.user.deleteMany();
  await prisma.department.deleteMany();
  await prisma.role.deleteMany();

  const hashedPassword = bcrypt.hashSync("1", 10);

  // Tạo vai trò
  await prisma.role.createMany({
    data: [
      { id: 1, name: "Sinh viên", code: "SV" },
      { id: 2, name: "Admin", code: "AD" },
      { id: 3, name: "Giảng viên", code: "GV" },
      { id: 4, name: "Trưởng Bộ Môn", code: "BM" },
      { id: 5, name: "Phòng Đào tạo", code: "DT" }
    ]
  });

  // Tạo bộ môn (ví dụ: Khoa CNTT)
  const departmentCNTT = await prisma.department.create({
    data: { name: "Khoa CNTT" }
  });

  // Tạo Trưởng Phòng Đào tạo
  await prisma.user.create({
    data: {
      name: "Trưởng Phòng Đào tạo",
      username: "training_director",
      password: hashedPassword,
      phone: "0900000042",
      roleId: 5
      // (Có thể thêm departmentId nếu cần)
    }
  });

  // Tạo Admin
  await prisma.user.create({
    data: {
      name: "Admin",
      username: "admin",
      password: hashedPassword,
      phone: "0900000001",
      roleId: 2
    }
  });

  // Tạo giám thị (Giảng viên)
  await prisma.user.createMany({
    data: Array.from({ length: 3 }, (_, i) => ({
      name: `Giám thị ${i + 1}`,
      username: `invigilator0${i + 1}`,
      password: hashedPassword,
      phone: `09000000${i + 2}`,
      roleId: 3,
      departmentId: departmentCNTT.id
    }))
  });

  // Tạo Trưởng Bộ Môn
  await prisma.user.createMany({
    data: Array.from({ length: 2 }, (_, i) => ({
      name: `Trưởng Bộ Môn ${i + 1}`,
      username: `head0${i + 1}`,
      password: hashedPassword,
      phone: `09000000${i + 5}`,
      roleId: 4,
      departmentId: departmentCNTT.id
    }))
  });

  // Tạo thông tin cá nhân cho các giám thị (Giảng viên)
  const invigilatorUsers = await prisma.user.findMany({ where: { roleId: 3 } });
  for (const user of invigilatorUsers) {
    await prisma.personalInfo.create({
      data: {
        userId: user.id,
        address: `Địa chỉ của ${user.name}`,
        birthdate: new Date(`198${Math.floor(Math.random() * 10)}-01-01`),
        email: `${user.username}@gmail.com`,
        department: "Khoa CNTT"
      }
    });
  }

  // Tạo môn học
  const subjectsData = ["Giải tích", "An ninh mạng", "Hệ điều hành", "Cơ sở dữ liệu", "Xác suất thống kê", "Lý thuyết đồ thị", "Tối ưu hóa", "Trí tuệ nhân tạo", "Mạng máy tính", "An toàn thông tin"];
  await prisma.subject.createMany({ data: subjectsData.map(name => ({ name })) });
  const subjects = await prisma.subject.findMany();
  // Tạo lớp học
  const classesData = ["CNTT01", "CNTT02", "ANM01", "ANM02", "CNTT03", "CNTT04", "CNTT05", "CNTT06", "CNTT07", "CNTT08"];
  const classes = await Promise.all(
    classesData.map(async (name, index) =>
      prisma.class.create({
        data: { name}
      })
    )
  );

  // Tạo sinh viên
  const students = await Promise.all(
    Array.from({ length: NUM_STUDENTS }, async (_, i) =>
      prisma.user.create({
        data: {
          name: `Sinh viên ${i + 1}`,
          username: `student${i + 1}`,
          password: hashedPassword,
          phone: `09100000${i + 1}`,
          roleId: 1,
          studentId: `SV${i + 1}`,
          classId: classes[i % classes.length].id
        }
      })
    )
  );

  // Tạo SubjectClass (liên kết giữa môn học và lớp)
  const subjectClasses = await Promise.all(
    classes.map(async (classObj, index) =>
      prisma.subjectClass.create({
        data: {
          subjectId: subjects[index % subjects.length].id,
          classId: classObj.id
        }
      })
    )
  );

  // Tạo phòng thi
  await prisma.examRoom.createMany({
    data: [{ name: "Phòng 101" }, { name: "Phòng 102" }, { name: "Phòng 103" }]
  });
  const examRooms = await prisma.examRoom.findMany();


  // Tạo kỳ thi (ExamSession) với startTime và endTime
  const examSessions = await Promise.all(
    examRooms.map(async (examRoom, index) =>
      prisma.examSession.create({
        data: {
          examRoomId: examRoom.id,
          status: "pending",
          startTime: new Date(new Date().getTime() + index * 2 * 60 * 60 * 1000),
          endTime: new Date(new Date(new Date().getTime() + index * 2 * 60 * 60 * 1000).getTime() + 2 * 60 * 60 * 1000)
        }
      })
    )
  );

  // Gán môn học (SubjectClass) vào từng kỳ thi
  for (const session of examSessions) {
    await prisma.examSessionSubjectClass.create({
      data: {
        examSessionId: session.id,
        subjectClassId: subjectClasses[Math.floor(Math.random() * subjectClasses.length)].id
      }
    });
  }

  // Gán sinh viên vào kỳ thi
  for (const session of examSessions) {
    await prisma.examSessionStudent.createMany({
      data: students.slice(0, 10).map(student => ({
        examSessionId: session.id,
        userId: student.id,
        status: ["registered", "present", "absent"][Math.floor(Math.random() * 3)]
      }))
    });
  }

  // Gán giám thị vào kỳ thi
  for (const session of examSessions) {
    await prisma.examSessionInvigilator.createMany({
      data: invigilatorUsers.map(user => ({
        examSessionId: session.id,
        invigilatorId: user.id,
        role: Math.random() > 0.5 ? "chief" : "assistant"
      }))
    });
  }

  console.log("✅ Seeding thành công!");
}

main()
  .catch(e => {
    console.error("❌ Lỗi khi seeding dữ liệu:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
