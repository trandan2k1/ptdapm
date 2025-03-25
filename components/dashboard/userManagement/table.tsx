import { useEffect, useState } from "react";
import Filter from "./filter";
import { Button, Flex, Table } from "antd";
import FormCreate from "./formCreate";


const TableUser = () => {
    const [filter, setFilter] = useState({
        roleId: 1,
        name: ""
    });
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const columns: any = [
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
        },
    ];


    const fetchUser = async () => {
        setLoading(true);
        const response = await fetch(`/api/user/findUser?roleId=${filter.roleId}&name=${filter.name}`);
        const data = await response.json();
        setLoading(false);
        setData(data);
    }

    useEffect(() => {
        fetchUser()
    }, [filter])
    const [visible, setVisible] = useState(false);
    return <>
        <Flex justify="space-between" className="w-full !mb-4">
            <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
            <Button type="primary" onClick={() => setVisible(true)}>
                Thêm mới
            </Button>
        </Flex>

        <Filter onChange={(key: string, value: any) => {
            setFilter({
                ...filter,
                [key]: value
            })
        }
        } />
        <FormCreate open={visible} onClose={() => setVisible(false)} refreshTable={fetchUser} />
        <Table loading={loading} className="mt-4" columns={columns} dataSource={data} />
    </>

}

export default TableUser;