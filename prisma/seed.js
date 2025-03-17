import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const NUM_STUDENTS = 20;

async function main() {
  console.log("🌱 Bắt đầu seeding dữ liệu...");

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

  const hashedPassword = bcrypt.hashSync("1", 10);

  // Tạo vai trò
  const roles = await prisma.role.createMany({
    data: [
      { id: 1, name: "Sinh viên" },
      { id: 2, name: "Admin" },
      { id: 3, name: "Giám thị" }
    ]
  });

  // Tạo Admin & Giám thị
  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      username: "admin",
      password: hashedPassword,
      phone: "0900000001",
      roleId: 2,
    }
  });

  const invigilators = await prisma.user.createMany({
    data: Array.from({ length: 3 }, (_, i) => ({
      name: `Giám thị ${i + 1}`,
      username: `invigilator0${i + 1}`,
      password: hashedPassword,
      phone: `09000000${i + 2}`,
      roleId: 3,
    }))
  });

  // Tạo môn học
  const subjects = await prisma.subject.createMany({
    data: [
      { name: "Toán" }, { name: "Vật lý" }, { name: "Hóa học" },
      { name: "Sinh học" }, { name: "Lịch sử" }, { name: "Địa lý" },
      { name: "Tin học" }, { name: "Tiếng Anh" }, { name: "Tiếng Nhật" },
      { name: "Xác suất thống kê" }
    ]
  });

  // Tạo lớp học
  const classes = await Promise.all(
    ["CNTT01", "CNTT02", "VLY01", "TOAN01", "HOA01"].map(async (name) =>
      prisma.class.create({ data: { name, subjectId: Math.ceil(Math.random() * 10) } })
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
          classId: classes[i % classes.length].id,
        },
      })
    )
  );

  // Tạo SubjectClass
  const subjectClasses = await Promise.all(
    classes.map(async (classObj, index) =>
      prisma.subjectClass.create({
        data: {
          name: `Môn ${index + 1} - ${classObj.name}`,
          subjectId: Math.ceil(Math.random() * 10),
          classId: classObj.id,
        },
      })
    )
  );

  // Gán sinh viên vào môn học
  for (const student of students) {
    await prisma.user.update({
      where: { id: student.id },
      data: {
        SubjectClass: {
          connect: [subjectClasses[Math.floor(Math.random() * subjectClasses.length)]],
        },
      },
    });
  }

  // Tạo phòng thi
  const examRooms = await prisma.examRoom.createMany({
    data: [{ name: "Phòng 101" }, { name: "Phòng 102" }, { name: "Phòng 103" }]
  });

  // Tạo lịch thi
  const examSchedules = await Promise.all(
    Array.from({ length: 3 }, (_, i) =>
      prisma.examSchedule.create({ data: { date: new Date(`2025-06-0${i + 1}T09:00:00Z`) } })
    )
  );

  // Tạo kỳ thi
  const examSessions = await Promise.all(
    examSchedules.map(async (schedule, i) =>
      prisma.examSession.create({
        data: {
          examScheduleId: schedule.id,
          examRoomId: i + 1,
          status: "pending",
        },
      })
    )
  );

  // Gán môn học vào kỳ thi
  for (const session of examSessions) {
    await prisma.examSessionSubjectClass.create({
      data: {
        examSessionId: session.id,
        subjectClassId: subjectClasses[Math.floor(Math.random() * subjectClasses.length)].id,
      },
    });
  }

  // Gán sinh viên vào kỳ thi
  for (const session of examSessions) {
    await prisma.examSessionStudent.createMany({
      data: students.slice(0, 10).map(student => ({
        examSessionId: session.id,
        userId: student.id,
        status: "registered",
      }))
    });
  }

  // Gán giám thị vào kỳ thi
  for (const session of examSessions) {
    await prisma.examSessionInvigilator.create({
      data: {
        examSessionId: session.id,
        invigilatorId: Math.ceil(Math.random() * 3),
        role: "chief",
      },
    });
  }

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
