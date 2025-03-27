import ExamScheduleTable from "./table";    
import '@ant-design/v5-patch-for-react-19';

const ExamSchedule = () => {
  return (
    <div className="flex flex-col gap-4">
      <ExamScheduleTable />
    </div>
  );
};

export default ExamSchedule;

