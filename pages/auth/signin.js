import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button, Input, Card, Typography, Alert, Form } from "antd";
import Link from "next/link";

export default function SignIn() {
  const [form] = Form.useForm();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleLogin = async (values) => {
    setLoading(true);
    const { username, password } = values;
    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });
    setLoading(false);
    if (!res.ok) {
      setError("Invalid username or password");
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div className="flex justify-center items-center h-[100vh] bg-gray-100">
      <Card style={{ width: 400, boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" }}>
        <Typography.Title level={2} className="text-center">
          Đăng nhập
        </Typography.Title>
        <Form form={form} onFinish={handleLogin} layout="vertical">
          <Form.Item
            label="Tên đăng nhập"
            name="username"
            rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
          >
            <Input placeholder="Tên đăng nhập" />
          </Form.Item>
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            validateStatus={error ? "error" : ""}
            help={error || ""}
          >
            <Input.Password placeholder="Mật khẩu" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" loading={loading} htmlType="submit" className="w-full h-[40px] rounded-md">
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
        <div className="text-center">
          <Link href="/auth/register" className="text-indigo-600 hover:text-indigo-500">
            Chưa có tài khoản? Đăng ký
          </Link>
        </div>
      </Card>
    </div>
  );
}