import { Button, message, Table } from "antd";
import { useState, useEffect } from "react";
import '@ant-design/v5-patch-for-react-19';

const SubjectManagementTable = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const columns = [
        {
          title: "Tên lớp", 
          dataIndex: "name",
          key: "name",
          render: (text: any, record: any, index: number) => {
            return <div className="font-bold">{text}</div>
          }
        },
        {
            title: "Mã môn học",
            key: "code",
            render: (record: any) => {
                if (!record.children) {
                    const code = record.subject?.split(" ").map((word: string) => word[0]).join("").toUpperCase();
                    return <div >{code + "-" + record.className}</div>
                }
            }
        },
        {
          title: "Môn học", 
          dataIndex: "subject",
          key: "subject",
        },
        {
            title: "Thao tác",
            dataIndex: "action",
            key: "action",
            render: (text: any, record: any, index: number) => {
                if (!record.children) {
                    return <Button type="primary" onClick={() => {}}>Sửa</Button>
                }
            }
        }
      ];



    const fetchSubject = async () => {
        try {
            const response = await fetch('/api/subject/getSubjectClass');
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error);
            }
            const data = await response.json();
            setData(data || []);
        } catch (error: any) {
            message.error(error.message);
        }
    };

    useEffect(() => {
        fetchSubject()
    }, [])

    return (
        <Table
            loading={loading}
            columns={columns}
            dataSource={data}
            pagination={false}
        />
    )

};

export default SubjectManagementTable;


