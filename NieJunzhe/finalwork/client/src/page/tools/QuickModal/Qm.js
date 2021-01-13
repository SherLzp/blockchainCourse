import React from 'react';
//tools
import { Select, Input, Button } from 'antd';
//css file
import './Qm.css';
const { Option } = Select;
const ButtonGroup = Button.Group;
//component
class Qm extends React.Component{
    constructor(props){
        super()
    }
    render(){
        return(
            <div className="pxIndexPageInfoQuick">
                <ButtonGroup className="pxIndexPageInfoQuickButtonBar">
                    <Button
                        className="pxIndexPageInfoQuickButton"
                        type={this.props.tablePost.txType===1?"primary":"default"}
                        style={{borderTopRightRadius:'0px',borderBottomRightRadius:0}}
                        >
                            众筹项目建议
                    </Button>
                </ButtonGroup>
                <div className="pxIndexPageInfoQuickContent">

                    <Input placeholder="请输入您的需求" className="pxIndexPageInfoQuickInput" />
                    <div className="pxIndexPageInfoQuickInput">
                        <Input placeholder="您的姓名" className="pxIndexPageInfoQuickInputHalf" />
                        <Input placeholder="联系方式" className="pxIndexPageInfoQuickInputHalf"/>
                    </div>
                    <Input placeholder="众筹金额建议" className="pxIndexPageInfoQuickInput" />
                    <Button style={{ width: "80%" }} onClick={()=>{this.props.handleSubmitPost()}}>提交需求</Button>
                </div>
            </div>
        )
    }
}

export default Qm;