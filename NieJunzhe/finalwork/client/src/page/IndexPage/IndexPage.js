import React from 'react';
//mytools
import Qmb from '../tools/QuickModalBar/Qmb'
//tools
import {Carousel, Input, message, notification} from 'antd';
//function-api
//css file
import './IndexPage.css';
import {addListener, getAccount, getAllFundings, getBlockNumber, getMyFundings} from "../../contracts/contract";


//component
class IndexPage extends React.Component {
  constructor(props){
    super()
    this.state={
      tablePost:{
        txType:0,
        pxType:0,
        pxName:'',
        phone:'',
        userName:'',
        content:''
      },
      todayState:{
        sell:0,
        buy:0,
        today:0,
        block:0
      },
      search:""
    }
  }
  fetchData = async() => {
    try {
      let newState = {}
      newState["sell"] = (await getAllFundings()).length;
      let res = await getMyFundings();
      newState["buy"] = (res.init).length;
      newState["today"] = (res.contr).length;
      newState["block"] =await getBlockNumber();

      this.setState({
          todayState:newState
      })
      console.log(newState);
    } catch (e) {
      console.log(e);
      message.error('获取众筹失败!');
    }
  }

  async  componentWillMount() {
    await this.fetchData();
    addListener(this.fetchData);
  }

  handleInfoChangePostContent= (e)=>{
    let tP= this.state.tablePost;
    tP.content= e.target.value;
    this.setState({tableLogin:tP})
  }
  handleSubmitPost = ()=>{
    notification['success']({
      message: '[测试功能，待开发]发布成功',
      description:
        "亲爱的用户"+",发布信息成功！",
      duration:2
    });
  }

  handleChangeSearch = (e)=>{
    this.setState({search:e.target.value})
  }
  render() {
    return (
      <div className="pxIndexPageInSide">
        <Carousel autoplay effect="scrollx">
          <div className="pxIndexPageAd">
          </div>
          <div className="pxIndexPageAd">
          </div>
        </Carousel>
        <Qmb
            number={this.state.todayState}
            tablePost={this.state.tablePost}
            handleSubmitPost={this.handleSubmitPost}
            />
    </div>
    )
    
  }
}

export default IndexPage;
