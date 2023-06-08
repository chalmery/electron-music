import React from 'react'
import {Layout, Table} from "antd";
import Sider from "antd/es/layout/Sider";
import {Content} from "antd/es/layout/layout";


export default function Local() {

    const dirList = [
        {
            key: 'Racing car sprays1 ',
            dir: 'Racing car sprays '
        },
        {
            key: 'Racing car sprays 2',
            dir: 'Racing car sprays '
        },
        {
            key: 'Racing car sprays3 ',
            dir: 'Racing car sprays '
        },
        {
            key: 'Racing car sprays 4',
            dir: 'Racing car sprays '
        }

    ];

    const dirColumn = [{title: 'dir', dataIndex: 'dir', key: 'dir'}];


    const dataSource = [
        {
            key: '1',
            name: '胡彦斌',
            age: 32,
            address: '西湖区湖底公园1号',
        },
        {
            key: '2',
            name: '胡彦祖',
            age: 42,
            address: '西湖区湖底公园1号',
        },
    ];

    const columns = [
        {
            title: '专辑图',
            dataIndex: 'picture',
            key: 'picture',
        },
        {
            title: '名称',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: '作者',
            dataIndex: 'artist',
            key: 'artist',
        },
        {
            title: '专辑',
            dataIndex: 'album',
            key: 'album',
        },
        {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
        },
    ];


    return (
        <Layout className='layout centerBg'>
            <Sider className='heightMax'>
                <Table
                    rowClassName='centerBg'
                    onRow={(record) => {
                        return {
                            onClick: (event) => {
                                console.log(record)
                            }
                        };
                    }}
                    bordered={true}
                    size={"small"}
                    columns={dirColumn}
                    pagination={false}
                    showHeader={false}
                    dataSource={dirList}
                />
            </Sider>
            <Layout className='rightBg'>
                <Content className='contentStyle'>
                    <Table
                        rowClassName='rightBg'
                        onRow={(record) => {
                            return {
                                onClick: (event) => {
                                    console.log(record)
                                }
                            };
                        }}
                        bordered={true}
                        size={"small"}
                        columns={columns}
                        pagination={false}
                        dataSource={dataSource}
                    />
                </Content>
            </Layout>
        </Layout>

    )
}