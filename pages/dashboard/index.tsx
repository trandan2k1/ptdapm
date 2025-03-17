import React, { useEffect, useState } from 'react';
import { HomeOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import ExamSchedule from './component/examSchedule';
const { Header, Content, Sider } = Layout;

const Dashboard = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
    }
  }, [session, status, router]);
  const [key, setKey] = useState('1');
  return (
    <Layout className='h-screen   '>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div className="demo-logo-vertical" />
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} className='h-full'>
            <Menu.Item key="1" icon={<HomeOutlined />} onClick={() => setKey('1')}>Quản lý lịch thi</Menu.Item>
            <Menu.Item key="2" icon={<UserOutlined />} onClick={() => setKey('2')}>Quản lý phòng thi</Menu.Item>
            <Menu.Item key="3" icon={<LogoutOutlined />} className='!fixed !bottom-0 !bg-transparent' onClick={() => {
              signOut();
            }}>
              Logout
            </Menu.Item>
          </Menu>
        </div>
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: '24px 16px 0' }}>
          <div style={{ padding: 24, minHeight: 360, background: colorBgContainer, borderRadius: borderRadiusLG }}>
            {key === '1' && <ExamSchedule />}
            {/* {key === '2' && <ExamRoom />} */}
          </div>
        </Content>
        {/* <Footer style={{ textAlign: 'center' }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer> */}
      </Layout>
    </Layout>
  );
};

export default Dashboard;
