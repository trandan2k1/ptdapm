import { Button, Flex, Input, message, Table } from "antd";
import { useState, useEffect } from "react";
import SubjectManagementFormCreate from "./formCreate";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const SubjectManagementTable = () => {
    const [data, setData] = useState([]);
    const [dataSrc, setDataSrc] = useState([]);
    const [loading, setLoading] = useState(false)
    const [expandedKeys, setExpandedKeys] = useState<string[]>(data.map((item: any) => item.key));
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Cập nhật expandedKeys khi dữ liệu thay đổi
        setExpandedKeys(data.map((item: any) => item.key));
    }, [data]);
    
    const handleSearch = (value: string) => {
        if (!value) {
            setDataSrc(data);
            setExpandedKeys(data.map((item: any) => item.key));
            return;
        }
    
        const filteredData: any = data
            .map((parent: any) => {
                const matchedChildren = parent.children.filter((child: any) =>
                    child.subject.toLowerCase().includes(value.toLowerCase())
                );
    
                if (matchedChildren.length > 0) {
                    return { ...parent, children: matchedChildren };
                }
    
                return null;
            })
            .filter(Boolean);
    
        setDataSrc(filteredData);
        setExpandedKeys(filteredData.map((item: any) => item.key)); // Mở rộng tất cả nhóm khớp kết quả tìm kiếm
    };
    const fetchSubject = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/subject/getSubjectClass');
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error);
            }
            setLoading(false)
            const data = await response.json();
            setDataSrc(data || []);
            setData(data || []);
        } catch (error: any) {
            message.error(error.message);
        }
    };

    useEffect(() => {
        fetchSubject()
    }, []);
    const columns: any = [
        {
            title: "Tên lớp",
            dataIndex: "name",
            key: "name",
            width: 150,
            render: (text: any, record: any, index: number) => {
                return <div className="font-bold">{text}</div>
            }
        },
        {
            title: "Mã lớp môn học",
            key: "code",
            width: 250,
            render: (record: any) => {
                if (!record.children) {
                    const code = record.subject?.split(" ").map((word: string) => word[0]).join("").toUpperCase();
                    return <div >{code + "-" + record.className}</div>
                }
            }
        },
        {
            title: "Môn học",
            width: 250,
            dataIndex: "subject",
            key: "subject",
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
                        <Button danger onClick={() => { }} icon={<DeleteOutlined />} />
                    </Flex>
                }
            }
        }
    ];

    
    return (
        <>
            <Flex justify="space-between" className="w-full">
                <h1 className="text-2xl font-bold">Môn thi</h1>
                <Button type="primary" onClick={() => setVisible(true)}>
                    Thêm mới
                </Button>
            </Flex>
    
            {/* Bộ lọc tìm kiếm */}
            <Input.Search
                placeholder="Tìm kiếm môn học"
                allowClear
                className="w-1/4"
                enterButton
                onClear={() => {
                    setDataSrc(data);
                    setExpandedKeys(data.map((item: any) => item.key));
                }}
                onSearch={handleSearch}
            />
    
            <SubjectManagementFormCreate open={visible} onClose={() => setVisible(false)} refreshData={fetchSubject} />
    
            <Table
                bordered
                loading={loading}
                columns={columns}
                dataSource={dataSrc}
                pagination={false}
                rowKey="key"
                scroll={{ x: true, y: "calc(100vh - 300px)" }}
                expandable={{
                    expandedRowKeys: expandedKeys,
                    onExpandedRowsChange: (key: any) => setExpandedKeys(key),
                }}
            />
        </>
    )
};

export default SubjectManagementTable;


