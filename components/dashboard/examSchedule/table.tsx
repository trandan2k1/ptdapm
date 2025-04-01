import { Button, Flex, message, Select, Table, Tag } from "antd";
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
    const [idEdit, setIdEdit] = useState(null)
    const handleChangeStatus = async (id: number, status: string) => {
        try {
            const response = await fetch(`/api/examSchedule/updateStatus`, {
                method: 'PUT',
                body: JSON.stringify({ id, status })
            })
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error);
            }
            message.success('Cập nhật trạng thái thành công')
            fetchExamSchedule()
            setIdEdit(null)
        } catch (error: any) {
            message.error(error.message)
        }
    }

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
        {
            title: "Trạng thái",
            key: "status",
            render: (r: any) => {
                return r.id == idEdit ? <Select
                className="w-[150px]"
                    defaultValue={r.status}
                    options={[
                        {
                            value: 'pending',
                            label: 'Chưa thi',
                        },
                        {
                            value: 'examined',
                            label: 'Đã thi',
                        },
                        {
                            value: 'graded',
                            label: 'Đang chấm thi',
                        },
                        {
                            value: 'finalized',
                            label: 'Đã hoàn thành',
                        }
                    ]}
                    onChange={(value) => { handleChangeStatus(r.id, value) }}
                /> : <Tag color={r.status === 'pending' ? 'orange' : r.status === 'examined' ? 'green' : r.status === 'graded' ? 'blue' : 'purple'} className="cursor-pointer" onClick={() => { setIdEdit(r.id) }}>
                    {r.status === 'pending' ? 'Chưa thi' : r.status === 'examined' ? 'Đã thi' : r.status === 'graded' ? 'Đang chấm thi' : 'Đã hoàn thành'}
                </Tag>
            }
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


