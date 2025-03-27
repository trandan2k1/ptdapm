import { Drawer, Typography, Descriptions, Table, Tag } from "antd"
import dayjs from "dayjs";

const { Title } = Typography;

const DrawerDetail = ({open, onClose}: {
    open: any,
    onClose: () => void
}) => {
    const columns = [
        {
            title: 'ID',
            dataIndex: ['student', 'id'],
            key: 'id',
        },
        {
            title: 'Tên sinh viên',
            dataIndex: ['student', 'name'],
            key: 'name',
        },
        {
            title: 'Mã sinh viên',
            dataIndex: ['student', 'studentId'],
            key: 'studentId',
        },
        {
            title: "Trạng thái",
            key: "status",
            dataIndex: "status",
            render: (status: any) => handleFormatStatus(status)
        }
    ];

    // [
    //     {
    //       "invigilator": {
    //         "name": "Giám thị 1",
    //         "id": 3
    //       },
    //       "role": "chief"
    //     },
    //     {
    //       "invigilator": {
    //         "name": "Giám thị 2",
    //         "id": 4
    //       },
    //       "role": "assistant"
    //     },
    //     {
    //       "invigilator": {
    //         "name": "Giám thị 3",
    //         "id": 5
    //       },
    //       "role": "assistant"
    //     }
    //   ]
    const columnsInvigilator = [
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
            dataIndex:"role",
            key: 'role',
            render: (role: any) => handleFormatRole(role)
        }

    ]

    const handleFormatRole= (role: string) => {
        switch (role) {
            case "assistant":
                return "Trợ lý";
            case "chief":
                return "Giám thị chính";
    }
}
    const handleFormatStatus = (status: string) => {
        switch (status) {
            case "registered":
                return "Đã đăng ký";
            case "present":
                return open.status === "pending" ? "Đã đăng ký" : "Có mặt";
            case "absent":
                return  open.status === "pending" ? "Đã đăng ký" : "Vắng mặt";
            case "disqualified":
                return "Cấm thi";
    }
}
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
                    <Title level={5} style={{ marginTop: 24, marginBottom: 16 }}>
                        Danh sách giám thị
                    </Title>
                    <Table 
                        columns={columnsInvigilator} 
                        dataSource={open.invigilators}
                        rowKey={(record: any) => record.invigilator.id}
                        pagination={false}
                    />
                    <Title level={5} style={{ marginTop: 24, marginBottom: 16 }}>
                        Danh sách sinh viên
                    </Title>
                    <Table 
                        columns={columns} 
                        dataSource={open.students}
                        rowKey={(record: any) => record.student.id}
                        pagination={false}
                    />
                </>
            )}
        </Drawer>
    )
}

export default DrawerDetail;
