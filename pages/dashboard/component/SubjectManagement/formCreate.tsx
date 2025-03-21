import { Drawer, Form, message, Select, Input, Button } from "antd";
import { useEffect, useState } from "react";

const SubjectManagementFormCreate = ({ open, onClose, refreshData }: any) => {
    const [form] = Form.useForm();
    const [classOptions, setClassOptions] = useState<any[]>([]);
    const [subjectOptions, setSubjectOptions] = useState<any[]>([]);
    const [newClass, setNewClass] = useState("");
    const [newSubject, setNewSubject] = useState("");
    const [loading, setLoading] = useState(false);
    const fetchClass = async () => {
        try {
            const response = await fetch("/api/subject/getListClass");
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error);
            }
            const data: any = await response.json();
            setClassOptions(data?.map((item: any) => ({ label: item.name, value: item.id })) || []);
        } catch (error: any) {
            message.error(error.message);
        }
    };

    const fetchSubject = async () => {
        try {
            const response = await fetch("/api/subject/getListSubjects");
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error);
            }
            const data: any = await response.json();
            setSubjectOptions(data?.map((item: any) => ({ label: item.name, value: item.id })) || []);
        } catch (error: any) {
            message.error(error.message);
        }
    };

    const handleAddClass = async () => {
        try {
            const response = await fetch("/api/subject/createClass", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: newClass }),
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error);
            }
            const res = await response.json();
            setClassOptions([...classOptions, { label: res.name, value: res.id }]);
            setNewClass("");
        } catch (error: any) {
            message.error(error.message);
        }
    };

    const handleAddSubject = async() => {
        try {
            const response = await fetch("/api/subject/createSubject", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: newSubject }),
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error);
            }
            const res = await response.json();
            setSubjectOptions([...subjectOptions, { label: res.name, value: res.id }]);
            setNewSubject("");
        } catch (error: any) {
            message.error(error.message);
        }
    };

    const handleOk = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            const response = await fetch("/api/subject/createSubjectClass", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });
            setLoading(false);
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error);
            }
            refreshData();
            message.success("Thêm lớp môn học thành công");
            onClose();
        } catch (error: any) {
            message.error(error.message);
        }
    }
    

    useEffect(() => {
        fetchClass();
        fetchSubject();
    }, []);

    return (
        <Drawer
            title="Tạo mới môn học"
            placement="right"
            width={400}
            closable={true}
            open={open}
            onClose={onClose}
        >
            <Form layout="vertical" onFinish={handleOk} form={form}>
                <Form.Item label="Lớp" name="classId">
                    <Select options={classOptions} placeholder="Chọn lớp" dropdownRender={menu => (
                        <div>
                            {menu}
                            <div style={{ display: 'flex', gap: '8px', padding: '8px' }}>
                                <Input
                                    placeholder="Thêm lớp mới"
                                    value={newClass}
                                    onChange={e => setNewClass(e.target.value)}
                                />
                                <Button type="primary" onClick={handleAddClass}>
                                    Thêm
                                </Button>
                            </div>
                        </div>
                    )} />
                </Form.Item>
                <Form.Item label="Môn học" name="subjectId">
                    <Select options={subjectOptions} placeholder="Chọn môn học" dropdownRender={menu => (
                        <div>
                            {menu}
                            <div style={{ display: 'flex', gap: '8px', padding: '8px' }}>
                                <Input
                                    placeholder="Thêm môn học mới"
                                    value={newSubject}
                                    onChange={e => setNewSubject(e.target.value)}
                                />
                                <Button type="primary" onClick={handleAddSubject}>
                                    Thêm
                                </Button>
                            </div>
                        </div>
                    )} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>Tạo</Button>
                </Form.Item>
            </Form>
        </Drawer>
    );
};

export default SubjectManagementFormCreate;