import React, { useEffect, useState } from 'react';
import { BookOutlined, CalendarOutlined, FolderViewOutlined, HomeOutlined, LogoutOutlined, PicCenterOutlined, SnippetsOutlined, UserOutlined } from '@ant-design/icons';
import { Layout, Menu, theme, Dropdown, Button, Avatar } from 'antd';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import ExamSchedule from '../components/dashboard/examSchedule';
import SubjectManagement from '../components/dashboard/subjectManagement';
import UserManagement from '../components/dashboard/userManagement';
import ExamProctoring from '@/components/dashboard/assignmentManagement/examProctoring';
import ExamGrading from '@/components/dashboard/assignmentManagement/examGrading';
const { Header, Content, Sider } = Layout;

const Dashboard = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [key, setKey] = useState('1');
  const items = [
    {
      key: '1',
      label: ' Quản lý lịch thi',
      icon: <BookOutlined />,
      onClick: () => setKey('1')
    },
    {
      key: '2',
      label: 'Quản lý môn thi',
      icon: <CalendarOutlined />,
      onClick: () => setKey('2')
    },
    {
      key: '3',
      label: 'Quản lý người dùng',
      icon: <UserOutlined />,
      onClick: () => setKey('3')
    },
    {
      key: 'quanlyphancong',
      label: 'Quản lý phân công',
      icon: <SnippetsOutlined />,
      children: [
        {
          key: '4',
          label: 'Phân công coi thi',
          icon: <FolderViewOutlined />,
          onClick: () => setKey('4')
        },
        {
          key: '5',
          label: 'Phân công chấm thi',
          icon: <BookOutlined />,
          onClick: () => setKey('5')
        }
      ]
    },
  ]

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
    }
  }, [session, status, router]);

  return (
    <Layout className='h-screen   '>
      <Sider breakpoint="lg" collapsedWidth="0" className='h-screen' width={250}>
        <div className="h-[64px]" />
        <div style={{ display: 'flex', flexDirection: 'column'  }}>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} className='h-[calc(100vh-64px)]' items={items} />
        </div>
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer, display: 'flex', justifyContent: 'flex-end', alignItems: "center", paddingRight: "16px" }} >

          <Dropdown menu={{
            items: [
              {
                key: '1',
                label: 'Trang cá nhân',
                icon: <HomeOutlined />,
                onClick: () => {
                  router.push('/profile');
                }
              },
              {
                type: 'divider',
              },
              {
                key: '2',
                label: 'Đăng xuất',
                icon: <LogoutOutlined />,
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
          <div style={{ padding: 24, minHeight: 360, background: colorBgContainer, borderRadius: borderRadiusLG }} className='h-[calc(100vh-100px)]'>
            {key === '1' && <ExamSchedule />}
            {key === '2' && <SubjectManagement />}
            {key === '3' && <UserManagement />}
            {key === '4' && <ExamProctoring />}
            {key === '5' && <ExamGrading />}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
