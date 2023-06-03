import React, {useEffect, useState} from 'react'
import {Form, Input} from "antd";
const Item = Form.Item;

function BaseS() {
    const [font, setFont] = useState(false)

    const formItemLayout = {
        //给表单布局用的
        labelCol: {span: 4},
        wrapperCol: {span: 16},
    };
    return (
        <div>
            <Form {...formItemLayout}>
                <Item label="默认字体" name="roleName">
                    <Input/>
                </Item>
            </Form>
        </div>
    )
}
export default BaseS
