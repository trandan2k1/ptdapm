import { Form, Select, DatePicker, Button, Drawer, Modal, Row, Col, message } from "antd"
import dayjs from "dayjs";
import { useEffect, useState } from "react"

const FormCreate = ({ open, onClose, refreshTable }: { open: boolean, onClose: () => void, refreshTable: () => void }) => {
    const [subjectClassOption, setSubjectClassOption] = useState<any[]>([]);
    const [examRoomOption, setExamRoomOption] = useState<any[]>([]);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const startTime = Form.useWatch(["startTime"], form);
    const fetchExamRoom = async () => {
        try {
            const response = await fetch('/api/examSchedule/getExamRoom')
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error);
            }
            const data = await response.json()
            setExamRoomOption(data?.map?.((item: any) => ({
                label: item.name,
                value: item.id
            })))
        } catch (error: any) {
            message.error(error.message)
        }
    }

    useEffect(() => {
        if (startTime) {
            form.setFieldsValue({
                endTime: dayjs(startTime).add(3, "hours")
            })
        }
    }, [startTime])
    const fetchSubjectClass = async () => {
        const response = await fetch('/api/subject/getSubjectClass?justSubjectClass=true')
        const data = await response.json()
        setSubjectClassOption(data?.map?.((item: any) => ({
            label: item.subject?.name?.split(" ").map((word: string) => word[0]).join("").toUpperCase() + "-" + item.class?.name,
            value: item.id
        })))
    }


    useEffect(() => {
        fetchExamRoom()
        fetchSubjectClass()
    }, [])

    const handleFinish = async (values: any) => {
        try {
            setLoading(true);
            const response = await fetch('/api/examSchedule/createExamSchedule', {
                method: 'POST',
                body: JSON.stringify(values)
            })
            setLoading(false);
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error);
            }
            message.success('Thêm lịch thi thành công')
            refreshTable()
            onClose()
        } catch (error: any) {
            message.error(error.message)
        } finally {
            setLoading(false);
        }
    }
    return (
        <Modal footer={false} title="Thêm lịch thi" open={open} onClose={onClose} onCancel={onClose} centered>
            <Form form={form} layout="vertical" onFinish={handleFinish}>
                <Form.Item name="examRoomId" label="Phòng thi">
                    <Select placeholder="Chọn phòng thi" allowClear filterOption={(input, option) =>
                        option?.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    } options={examRoomOption} />
                </Form.Item>
                <Form.Item name="subjectClassId" label="Lớp môn học">
                    <Select placeholder="Chọn lớp môn học" allowClear showSearch filterOption={(input, option) =>
                        option?.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    } options={subjectClassOption} />
                </Form.Item>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="startTime" label="Thời gian bắt đầu">
                            {/* pick hour and minute and date */}
                            <DatePicker className="w-full" placeholder="Chọn thời gian bắt đầu" format="HH:mm DD/MM/YYYY" showTime />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="endTime" label="Thời gian kết thúc">
                            <DatePicker className="w-full" placeholder="Chọn thời gian kết thúc" format="HH:mm DD/MM/YYYY" showTime />
                        </Form.Item></Col>
                </Row>
                <Form.Item>
                    <Button className="w-full" type="primary" htmlType="submit" loading={loading}>
                        Tạo
                    </Button>
                </Form.Item>
                {/* <Form.Item name="students" label="Sinh viên tham gia">  
                    <AutocompleteUser roleId={ROLE_STUDENT} />
                </Form.Item> */}
            </Form>
        </Modal>
    )
}

export default FormCreate;
