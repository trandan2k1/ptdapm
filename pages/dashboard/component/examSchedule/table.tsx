import { message, Table } from "antd";
import { useState, useEffect } from "react";

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

    const fetchData = () => {
        setLoading(true)
        fetch('/api/getExamSchedule').then(res => res.json()).then(res => {
            setData(res || [])
        }).catch(err => message.error(err.message)).finally(() => setLoading(false))
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <Table loading={loading} columns={columns} dataSource={data} />
    )

};

export default ExamScheduleTable;


