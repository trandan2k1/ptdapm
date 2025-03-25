import { Flex, Input, Select } from "antd";
import debounce from "lodash.debounce";
const Filter = ({onChange}: any) => { 

    const debounceSearch = debounce((value: string) => { 
        onChange('name', value)
    }, 300)

    return  <Flex gap="10px">
        <Input.Search placeholder="Tìm kiếm theo tên" onChange={(e) => debounceSearch(e.target.value)} />
        <Select placeholder="Chọn quyền" className="w-[300px]" 
        defaultValue={1}
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
        onChange={(value) => onChange('roleId', value)}
        />
    </Flex>
}

export default Filter;