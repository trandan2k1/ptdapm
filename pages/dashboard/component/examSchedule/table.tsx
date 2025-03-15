import { Table } from "antd";
import { useState, useEffect } from "react";

const ExamScheduleTable = () => {
    const [data, setData] = useState([])
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

    const fetchData = async () => {
        const res = await fetch('/api/getExamSchedule')
        const data = await res.json()
        setData(data)
    }

    useEffect(() => {
        fetchData()
    }, [])
    
    return (
        <Table columns={columns} dataSource={data} />
    )
  
};

export default ExamScheduleTable;


