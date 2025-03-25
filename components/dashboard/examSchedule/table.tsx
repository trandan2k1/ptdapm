import { Button, Flex, message, Table, Tag } from "antd";
import { useState, useEffect } from "react";
import '@ant-design/v5-patch-for-react-19';
import moment from 'moment';
import { EditOutlined } from '@ant-design/icons';
import FormCreate from "./formCreate";
import DrawerDetail from "./detail";

const ExamScheduleTable = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [openDetail, setOpenDetail] = useState(null)
    const columns: any = [
        {
            title: 'Mã lớp môn học',
            key: 'subjectCode',
            render: (record: any) => { 
                const r = record.examSessionSubjectClasses?.[0]?.subjectClass;
                const code = r.subject?.name?.split(" ").map((word: string) => word[0]).join("").toUpperCase();
                return <a onClick={() => { setOpenDetail(record)}} href="#">{code + ' - ' + r.class?.name}</a>
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
                return      <Tag color={r.status === 'pending' ? 'orange' : 'green'}>
                {r.status === 'pending' ? 'Chưa thi' : 'Hoàn thành'}
            </Tag>
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
            setLoading(true)
          const response = await fetch('/api/examSchedule/getExamSchedule');
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
            <h1 className="text-2xl font-bold">Quản lý lịch thi</h1>
            <Button type="primary" onClick={() => { setOpen(true) }} >
                Thêm mới
            </Button>
        </Flex>
        <FormCreate open={open} onClose={() => setOpen(false)} refreshTable={fetchExamSchedule} />
        <DrawerDetail open={openDetail} onClose={() => setOpenDetail(null)} />
        <Table loading={loading} columns={columns} dataSource={data} />
        </>

    )

};

export default ExamScheduleTable;


