import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// async function main() {
//   await prisma.examSession.deleteMany({})
//   await prisma.examSchedule.deleteMany({})
//   await prisma.subject.deleteMany({})
//   await prisma.examRoom.deleteMany({})
//   await prisma.user.deleteMany({})
//   await prisma.role.deleteMany({})
//   await prisma.class.deleteMany({})

//   // Seed Subjects
//   const subjects = [
//     { name: 'Giải tích' },
//     { name: 'Đại số' },
//     { name: 'Hình học' },
//     { name: 'Lý thuyết xác suất' },
//     { name: 'Thống kê' },
//     { name: 'Cơ sở dữ liệu' },
//     { name: 'Trí tuệ nhân tạo' },
//     { name: 'Mạng máy tính' },
//     { name: 'Hệ điều hành' },
//     { name: 'Mạng máy tính' },
//   ]

//   for (const subject of subjects) {
//     await prisma.subject.create({
//       data: subject
//     })
//   }

//   // Seed Roles
//   const roles = [
//     { name: 'Sinh viên', id: 1 },
//     { name: 'Admin', id: 2 },
//     { name: 'Giảng viên', id: 3 },
//   ]

//   for (const role of roles) {
//     await prisma.role.create({
//       data: role
//     })
//   }

//   await prisma.user.create({
//     data: {
//       name: 'Admin',
//       username: 'admin',
//       password: 'admin',
//       roleId: 2,
//       phone: '0909090909',
//     }
//   })

//   // Seed Classes
//   const classes = [
//     { name: '64TH1' },
//     { name: '64TH2' },
//     { name: '64TH3' },
//     { name: '64TH4' },
//     { name: '64TH5' },
//     { name: '64TH6' }
//   ]

//   for (const class_ of classes) {
//     await prisma.class.create({
//       data: class_
//     })
//   }

//   // Seed ExamRooms
//   const examRooms = [
//     { name: '202 A2' },
//     { name: '203 A3' },
//     { name: '209 A2' },
//     { name: '203 A2' },
//     { name: '205 A2' },
//     { name: '207 A3' }
//   ]

//   for (const room of examRooms) {
//     await prisma.examRoom.create({
//       data: room
//     })
//   }
// }

// main()
//   .catch((e) => {
//     console.error(e)
//     process.exit(1)
//   })
//   .finally(async () => {
//     await prisma.$disconnect()
//   })



async function main() {
  console.log("🌱 Bắt đầu seeding dữ liệu...");

  // 1️⃣ Xóa toàn bộ dữ liệu trước khi seed (nếu cần)
  await prisma.examSessionStudent.deleteMany();
  await prisma.examSessionInvigilator.deleteMany();
  await prisma.examSessionSubjectClass.deleteMany();
  await prisma.examSession.deleteMany();
  await prisma.examSchedule.deleteMany();
  await prisma.examRoom.deleteMany();
  await prisma.subjectClass.deleteMany();
  await prisma.class.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();

  // 2️⃣ Tạo vai trò (Role)
  const adminRole = await prisma.role.create({ data: { name: "Admin" } });
  const invigilatorRole = await prisma.role.create({ data: { name: "Giám thị" } });
  const studentRole = await prisma.role.create({ data: { name: "Sinh viên" } });

  // 3️⃣ Tạo tài khoản người dùng
  const admin = await prisma.user.create({
    data: {
      name: "Nguyễn Văn A",
      username: "admin",
      password: "123456",
      phone: "0900000001",
      roleId: adminRole.id,
    },
  });

  const invigilator = await prisma.user.create({
    data: {
      name: "Trần Thị B",
      username: "giamsat01",
      password: "123456",
      phone: "0900000002",
      roleId: invigilatorRole.id,
    },
  });

  const student = await prisma.user.create({
    data: {
      name: "Lê Văn C",
      username: "student01",
      password: "123456",
      phone: "0900000003",
      roleId: studentRole.id,
      studentId: "SV001",
    },
  });

  // 4️⃣ Tạo môn học
  const mathSubject = await prisma.subject.create({ data: { name: "Toán cao cấp" } });
  const physicsSubject = await prisma.subject.create({ data: { name: "Vật lý đại cương" } });

  // 5️⃣ Tạo lớp học
  const classA = await prisma.class.create({
    data: {
      name: "64ANM",
      subjectId: mathSubject.id,
    },
  });

  const classB = await prisma.class.create({
    data: {
      name: "64CNTT",
      subjectId: physicsSubject.id,
    },
  });

  // 6️⃣ Gán sinh viên vào lớp học
  await prisma.user.update({
    where: { id: student.id },
    data: { classId: classA.id },
  });

  // 7️⃣ Tạo môn học trong lớp
  const subjectClassA = await prisma.subjectClass.create({
    data: {
      name: "TCC - 64ANM",
      subjectId: mathSubject.id,
      classId: classA.id,
    },
  });

  const subjectClassB = await prisma.subjectClass.create({
    data: {
      name: "VLDC - 64CNTT",
      subjectId: physicsSubject.id,
      classId: classB.id,
    },
  });

  // 8️⃣ Gán sinh viên vào môn học
  await prisma.user.update({
    where: { id: student.id },
    data: {
      SubjectClass: {
        connect: [{ id: subjectClassA.id }],
      },
    },
  });

  // 9️⃣ Tạo phòng thi
  const examRoom1 = await prisma.examRoom.create({ data: { name: "Phòng 101" } });
  const examRoom2 = await prisma.examRoom.create({ data: { name: "Phòng 102" } });

  // 🔟 Tạo lịch thi
  const examSchedule1 = await prisma.examSchedule.create({
    data: {
      date: new Date("2025-06-01T09:00:00Z"),
    },
  });

  // 1️⃣1️⃣ Tạo kỳ thi
  const examSession1 = await prisma.examSession.create({
    data: {
      examScheduleId: examSchedule1.id,
      examRoomId: examRoom1.id,
      status: "pending",
    },
  });

  // 1️⃣2️⃣ Liên kết môn học với kỳ thi
  await prisma.examSessionSubjectClass.create({
    data: {
      examSessionId: examSession1.id,
      subjectClassId: subjectClassA.id,
    },
  });

  // 1️⃣3️⃣ Gán sinh viên vào kỳ thi
  await prisma.examSessionStudent.create({
    data: {
      examSessionId: examSession1.id,
      userId: student.id,
      status: "registered",
    },
  });

  // 1️⃣4️⃣ Gán giám thị vào kỳ thi
  await prisma.examSessionInvigilator.create({
    data: {
      examSessionId: examSession1.id,
      invigilatorId: invigilator.id,
      role: "chief",
    },
  });

  console.log("✅ Seeding thành công!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });