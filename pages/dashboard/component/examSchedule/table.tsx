import { message, Table } from "antd";
import { useState, useEffect } from "react";
import '@ant-design/v5-patch-for-react-19';

const ExamScheduleTable = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const columns = [
        {
            title: 'Mã môn học',
            dataIndex: 'subjectCode',
            key: 'subjectCode',
        },
        {
            title: 'Tên môn học',
            dataIndex: 'subjectName',
            key: 'subjectName',
        },
        {
            title: 'Ngày thi',
            dataIndex: 'examDate',
            key: 'examDate',
        },
    ]

    const fetchExamSchedule = async () => {
        try {
          const response = await fetch('/api/getExamSchedule');
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
        fetchExamSchedule()
    }, [])

    return (
        <Table loading={loading} columns={columns} dataSource={data} />
    )

};

export default ExamScheduleTable;


