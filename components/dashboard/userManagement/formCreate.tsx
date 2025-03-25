import { Form, Select, DatePicker, Button, Drawer, Modal, Row, Col, message, Input } from "antd"
import dayjs from "dayjs";
import { useEffect, useState } from "react"

const FormCreate = ({ open, onClose, refreshTable }: { open: boolean, onClose: () => void, refreshTable: () => void }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);


    const handleFinish = async (values: any) => {
        try {
            setLoading(true);
            const response = await fetch('/api/user/addUser', {
                method: 'POST',
                body: JSON.stringify(values)
            })
            setLoading(false);
            const data = await response.json()
            message.success(data.message)
            refreshTable()
            onClose()
        } catch (error) {
            message.error("Lỗi khi tạo lịch thi")
        } finally {
            setLoading(false);
        }
    }
    return (
        <Modal footer={false} title="Thêm tài khoản" open={open} onClose={onClose} onCancel={onClose} centered>
            <Form form={form} layout="vertical" onFinish={handleFinish}>
                <Form.Item
                    label="Họ và tên"
                    name="name"
                    rules={[{ required: true, message: 'Hãy nhập họ và tên' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Tên đăng nhập"
                    name="username"
                    rules={[{ required: true, message: 'Hãy nhập tên đăng nhập' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Mật khẩu"
                    name="password"
                    rules={[{ required: true, message: 'Hãy nhập mật khẩu' }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    label="Số điện thoại"
                    name="phone"
                    rules={[{ required: true, message: 'Hãy nhập số điện thoại' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Quyền"
                    name="roleId"
                    rules={[{ required: true, message: 'Hãy chọn quyền' }]}
                >
                    <Select placeholder="Chọn quyền" className="w-[300px]"
                        options={[
                            {
                                value: 1,
                                label: 'Sinh viên'
                            },
                            {
                                value: 3,
                                label: 'Giảng viên'
                            },
                            {
                                value: 4,
                                label: 'Trưởng Bộ Môn'
                            },
                            {
                                value: 5,
                                label: 'Phòng Đào tạo'
                            }
                        ]}
                    />
                </Form.Item>
                <Form.Item>
                    <Button className="w-full" type="primary" htmlType="submit" loading={loading}>
                        Tạo
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default FormCreate;
