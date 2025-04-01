import { Button, Flex, message, Table } from "antd";
import moment from "moment";
import router from "next/router";
import { useState, useEffect } from "react";
import DrawerDetail from "./detail";

const ExamProctoringTable = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [openDetail, setOpenDetail] = useState(null)
    const columns: any = [
        {
            title: 'Mã lớp môn học',
            key: 'subjectCode',
            render: (record: any) => {
                const r = record.examSessionSubjectClasses?.[0]?.subjectClass;
                const code = r.subject?.name?.split(" ").map((word: string) => word[0]).join("").toUpperCase();
                return <a onClick={() => { setOpenDetail(record) }} href="#">{code + ' - ' + r.class?.name}</a>
            }
        },
        {
            title: 'Phòng thi',
            key: 'examRoom',
            render: (r: any) => r.examRoom?.name
        },
        {
            title: 'Thời gian thi',
            key: 'examDate',
            render: (r: any) => `${moment(r.startTime).format('HH:mm')} - ${moment(r.endTime).format('HH:mm DD/MM/YYYY')}`
        },
    ]

    const fetchExamSchedule = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/examSchedule/getExamSchedule?status=pending');
            setLoading(false)
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
        <> 
            <Flex justify="space-between" align="center">
                <h1 className="text-2xl font-bold">Phân công chấm thi</h1>
            </Flex>
            <Table dataSource={data} columns={columns} loading={loading} />
            <DrawerDetail open={openDetail} onClose={() => setOpenDetail(null)} />
        </>
    )
}

export default ExamProctoringTable;
