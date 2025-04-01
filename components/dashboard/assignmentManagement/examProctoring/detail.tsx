import { Drawer, Typography, Descriptions, Table, Tag, Button, message, Flex, Modal, Form, Select } from "antd"
import dayjs from "dayjs";
import { DeleteOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
const { Title } = Typography;

const DrawerDetail = ({ open, onClose }: {
    open: any,
    onClose: () => void
}) => {
    const [dataSrc, setDataSrc] = useState(open?.invigilators || [])
    const [form] = Form.useForm()
    const [invigilators, setInvigilators] = useState<any>([])
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        setDataSrc(open?.invigilators || [])
        fetchInvigilators()
    }, [open])
    const columnsInvigilator: any = [
        {
            title: 'ID',
            dataIndex: ['invigilator', 'id'],
            key: 'id',
        },
        {
            title: 'Tên giám thị',
            dataIndex: ['invigilator', 'name'],
            key: 'name',
        },
        {
            title: "Vai trò",
            dataIndex: "role",
            key: 'role',
            render: (role: any) => handleFormatRole(role)
        },
        {
            title: "Thao tác",
            key: "action",
            align: "center",
            render: (record: any) => {
                return (
                    <Button danger onClick={() => handleDeleteInvigilator(record.id)} icon={<DeleteOutlined />} />
                )
            }
        }

    ]

    const fetchInvigilators = async () => {
        const response = await fetch(`/api/user/findUser?roleId=3`)
        const data = await response.json()
        setInvigilators(data)
    }

    const handleDeleteInvigilator = async (id: number) => {
        try {
            const response = await fetch(`/api/examSchedule/deleteInvigilator`, {
                method: 'DELETE',
                body: JSON.stringify({ id })
            })
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error);
            }
            message.success("Xóa giám thị thành công")
            setDataSrc(dataSrc.filter((item: any) => item.id !== id))
        } catch (error: any) {
            message.error(error.message)
        }
    }

    const handleAddInvigilator = async () => {
        try {
            setLoading(true)
            const response: any = await fetch(`/api/examSchedule/addInvigilatorToExamSchedule`, {
                method: 'POST',
                body: JSON.stringify({ id: open.id, invigilatorId: form.getFieldValue('invigilatorId'), role: form.getFieldValue('role') })
            })
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error);
            }
            message.success("Thêm giám thị thành công")
            setOpenModalAddInvigilator(false)
            setDataSrc([...dataSrc, { id: response.id, invigilator: { id: form.getFieldValue('invigilatorId'), name: invigilators.find((item: any) => item.id === form.getFieldValue('invigilatorId')).name }, role: form.getFieldValue('role') }])
        } catch (error: any) {
            message.error(error.message)
        } finally {
            setLoading(false)
        }
    }
    const handleFormatRole = (role: string) => {
        switch (role) {
            case "assistant":
                return "Trợ lý";
            case "chief":
                return "Giám thị chính";
        }
    }
    const [openModalAddInvigilator, setOpenModalAddInvigilator] = useState(false)

    return (
        <Drawer width="60vw" title="Chi tiết lịch thi" open={!!open} onClose={onClose}>
            {open && (
                <>
                    <Descriptions title="Thông tin chung" bordered column={2}>
                        <Descriptions.Item label="Thời gian bắt đầu">
                            {dayjs(open.startTime).format('DD/MM/YYYY HH:mm')}
                        </Descriptions.Item>
                        <Descriptions.Item label="Thời gian kết thúc">
                            {dayjs(open.endTime).format('DD/MM/YYYY HH:mm')}
                        </Descriptions.Item>
                        <Descriptions.Item label="Phòng thi">
                            {open.examRoom.name}
                        </Descriptions.Item>
                        <Descriptions.Item label="Trạng thái">
                            <Tag color={open.status === 'pending' ? 'orange' : 'green'}>
                                {open.status === 'pending' ? 'Chưa thi' : 'Hoàn thành'}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Môn học" span={2}>
                            {open.examSessionSubjectClasses[0]?.subjectClass?.subject?.name} - {open.examSessionSubjectClasses[0]?.subjectClass?.class?.name}
                        </Descriptions.Item>
                    </Descriptions>
                    <Flex justify="space-between" align="center">
                        <Title level={5} style={{ marginTop: 24, marginBottom: 16 }}>
                            Danh sách giám thị
                        </Title>
                        <Button type="primary" onClick={() => setOpenModalAddInvigilator(true)}>Thêm giám thị</Button>
                    </Flex>
                    <Table
                        columns={columnsInvigilator}
                        dataSource={dataSrc}
                        rowKey={(record: any) => record.invigilator.id}
                        pagination={false}
                    />
                    <Modal okText="Thêm" cancelText="Hủy" centered open={openModalAddInvigilator} onCancel={() => {
                        setOpenModalAddInvigilator(false)
                        form.resetFields()
                    }} confirmLoading={loading} onOk={handleAddInvigilator}>
                        <Form layout="vertical" onFinish={handleAddInvigilator} className="!py-8" form={form}>
                            <Form.Item label="Tên giám thị" name="invigilatorId" rules={[{ required: true, message: 'Vui lòng chọn giám thị' }]}>
                                <Select placeholder="Chọn giám thị" options={invigilators?.map((item: any) => {
                                    if (dataSrc.find((item2: any) => item2.invigilator.id === item.id)) {
                                        return null
                                    }
                                    return { label: item.name, value: item.id }
                                }).filter((item: any) => item !== null)} />
                            </Form.Item>
                            <Form.Item label="Vai trò" name="role" rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}>
                                <Select>
                                    <Select.Option value="assistant" >Trợ lý</Select.Option>
                                    <Select.Option value="chief">Giám thị chính</Select.Option>
                                </Select>
                            </Form.Item>
                        </Form>
                    </Modal>
                </>
            )}
        </Drawer>
    )
}

export default DrawerDetail;
