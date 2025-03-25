import { Button, Drawer, Flex } from "antd";
import SubjectManagementTable from "./table";    
import '@ant-design/v5-patch-for-react-19';
import SubjectManagementFormCreate from "./formCreate";
import { useState } from "react";

const SubjectManagement = () => {


  return (
    <div className="flex flex-col gap-4">
      <SubjectManagementTable />
    </div>
  );
};

export default SubjectManagement;

