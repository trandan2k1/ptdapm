import { Button, Flex, message, Table, Tag } from "antd";
import { useState, useEffect } from "react";
import '@ant-design/v5-patch-for-react-19';
import moment from 'moment';
import { EditOutlined } from '@ant-design/icons';
import Link from "next/link";

const ExamScheduleTable = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const columns: any = [
        {
            title: 'Mã lớp môn học',
            key: 'subjectCode',
            render: (record: any) => { 
                const r = record.examSessionSubjectClasses?.[0]?.subjectClass;
                const code = r.subject?.name?.split(" ").map((word: string) => word[0]).join("").toUpperCase();
                return <Link href={`/subject-class/${r._id}`}>{code + ' - ' + r.class?.name}</Link>
            }
        },
        {
            title: 'Phòng thi',
            key: 'examRoom',
            render: (r: any) => r.examRoom?.name
        },
        {
            title: "Trạng thái",
            key: "status",
            render: (r: any) => {
                return <Tag color={r.status === "pending" ? "warning" : "success"}>{r.status}</Tag>
            }
        },
        {
            title: 'Thời gian thi',
            key: 'examDate',
            render: (r: any) => `${moment(r.startTime).format('HH:mm')} - ${moment(r.endTime).format('HH:mm DD/MM/YYYY')}`
        },
        {
            title: "Thao tác",
            dataIndex: "action",
            key: "action",
            fixed: "right",
            width: 100,
            align: "center",
            render: (text: any, record: any, index: number) => {
                if (!record.children) {
                    return <Flex gap={12} justify="center">
                        <Button type="primary" onClick={() => { }} icon={<EditOutlined />} />
                        {/* <Button danger onClick={() => { }} icon={<DeleteOutlined />} /> */}
                    </Flex>
                }
            }
        }
    ]

    const fetchExamSchedule = async () => {
        try {
          const response = await fetch('/api/examSchedule/getExamSchedule');
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


