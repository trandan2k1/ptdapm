import { Drawer, Typography, Descriptions, Table, Tag } from "antd"
import dayjs from "dayjs";

const { Title } = Typography;

const DrawerDetail = ({open, onClose}: {
    open: any, // Should be the data object or false
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
        }
    ];
    
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
                                {open.status === 'pending' ? 'Chờ xử lý' : 'Hoàn thành'}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Môn học" span={2}>
                            {open.examSessionSubjectClasses[0]?.subjectClass?.subject?.name} - {open.examSessionSubjectClasses[0]?.subjectClass?.class?.name}
                        </Descriptions.Item>
                    </Descriptions>

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
