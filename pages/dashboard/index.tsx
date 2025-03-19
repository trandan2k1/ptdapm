import React, { useEffect, useState } from 'react';
import { HomeOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Layout, Menu, theme, Dropdown, Button, Avatar } from 'antd';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import ExamSchedule from './component/examSchedule';
import SubjectManagement from './component/SubjectManagement';
const { Header, Content, Sider } = Layout;

const Dashboard = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { data: session, status } = useSession();
  const router = useRouter();

  const items = [
    {
      key: '1',
      label: 'Quản lý lịch thi',
      icon: <HomeOutlined />,
      onClick: () => setKey('1')
    },
    {
      key: '2',
      label: 'Quản lý phòng thi',
      icon: <UserOutlined />,
      onClick: () => setKey('2')
    },
    {
      key: '3',
      label: 'Quản lý môn thi',
      icon: <UserOutlined />,
      onClick: () => setKey('3')
    }
  ]

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
    }
  }, [session, status, router]);
  const [key, setKey] = useState('1');
  return (
    <Layout className='h-screen   '>
      <Sider breakpoint="lg" collapsedWidth="0" className='h-screen'>
        <div className="h-[64px]" />
        <div style={{ display: 'flex', flexDirection: 'column'  }}>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} className='h-[calc(100vh-64px)]' items={items} >
            {/* <Menu.Item key="1" icon={<HomeOutlined />} onClick={() => setKey('1')}>Quản lý lịch thi</Menu.Item>
            <Menu.Item key="2" icon={<UserOutlined />} onClick={() => setKey('2')}>Quản lý phòng thi</Menu.Item> */}
            <Menu.Item key="3" icon={<LogoutOutlined />} className='!fixed !bottom-0 !bg-transparent' onClick={() => {
              signOut();
            }}>
              Logout
            </Menu.Item>
          </Menu>
        </div>
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer, display: 'flex', justifyContent: 'flex-end', alignItems: "center", paddingRight: "16px" }} >

          <Dropdown menu={{
            items: [
              {
                key: '1',
                label: 'User Profile',
                onClick: () => {
                  router.push('/profile');
                }
              },
              {
                type: 'divider',
              },
              {
                key: '2',
                label: 'Logout',
                onClick: () => {
                  signOut();
                }
              }
            ]
          }}>
            <Avatar icon={<UserOutlined />} className='cursor-pointer' />
          </Dropdown>
        </Header>
        <Content style={{ margin: '24px 16px 0' }} >
          <div style={{ padding: 24, minHeight: 360, background: colorBgContainer, borderRadius: borderRadiusLG }}>
            {key === '1' && <ExamSchedule />}
            {key === '3' && <SubjectManagement />}
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
