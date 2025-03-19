import SubjectManagementTable from "./table";    

const SubjectManagement = () => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Môn thi</h1>
      <SubjectManagementTable />
    </div>
  );
};

export default SubjectManagement;

