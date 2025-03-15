import ExamScheduleTable from "./table";    

const ExamSchedule = () => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Lịch thi</h1>
      <ExamScheduleTable />
    </div>
  );
};

export default ExamSchedule;

