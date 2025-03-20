import { ROLE_STUDENT } from "@/utils/const";
import { AutoComplete } from "antd"
import { useEffect, useState } from "react"

const AutocompleteUser = ({ roleId, onSelect }: any) => {
    const [options, setOptions] = useState<any[]>([]);
    const [value, setValue] = useState<string>("");
    const [debouncedSearchValue, setDebouncedSearchValue] = useState<string>("");

    const fetchStudent = async () => {
        const response = await fetch(`/api/user/findStudent?name=${debouncedSearchValue}&roleId=${roleId}`);
        const data = await response.json();
        setOptions(data?.map((item: any) => ({
            label: item.name + " - " + item.studentId,
            value: item.id
        })));
    }

    const handleSearch = (value: string) => {
        setDebouncedSearchValue(value);
    }

    useEffect(() => {
        fetchStudent();
    }, [debouncedSearchValue]);

    return (
        <AutoComplete
            options={options}
            value={value}
            onChange={(value) => setValue(value)}
            onSearch={handleSearch}
            onSelect={onSelect}
            placeholder="Tìm kiếm sinh viên"
        />
    )
}

export default AutocompleteUser;