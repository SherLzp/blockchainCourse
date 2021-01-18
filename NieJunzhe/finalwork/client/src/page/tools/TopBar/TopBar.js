import React from 'react';

//tools
import { PageHeader} from 'antd';

//css file
import './TopBar.css';
//component


class TopBar extends React.Component{
    constructor(props){
        super()
      }


    render(){
        return(
            <div className="pxIndexPageTopBar">
                <div>
                    <PageHeader
                    className="site-page-header"
                    onBack={() => null}
                    title="当前账户地址："
                    subTitle={this.props.account}
                    />
                </div>
            </div>

        )
    }
}
export default TopBar;