import React from 'react';
import './Topbarcss.css'
import {Card,List} from 'antd';
import picurl from './panda.jpg'
import {Link} from 'react-router-dom';
import {getProMes, getPronum,timestampToTime,isMy} from "../function/function";
const{Meta}=Card;
class myProject extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            allprojects:[],
            path:"",
        }
    }

    getpath=async (id)=>{
        let ismy=await isMy(Number(id));
        if(ismy===true)
            return '/myfunding/'+id;
        else
            return '/funding/'+id;
    };



    getitempath=(id)=>{
        if(this.state.path==="")
            return "";
        else{
            return this.state.path[Number(id)]
        }
    }

    async componentDidMount() {
        let pronum=await getPronum();
        var arr=[];
        var allpath=[];
        for(var i=0;i<pronum;i++){
            let ismy=await isMy(i);
            if(ismy===true){
                let message=await getProMes(i);
                let time=timestampToTime(Number(message.ddl)).substring(5,16);
                let path=await this.getpath(i.toString());
                var ele={
                    title:message.title,
                    money:message.goal,
                    time:time,
                    id:message.id,
                    state:message.state,
                    nowmoney:message.nowmoney,
                };
                arr.push(ele);
                allpath.push(path);
            }
            else
                allpath.push('');
        }
        this.setState({
            allprojects:arr,
            path:allpath,
        })
    }

    baseonstate=(state,now)=>{
        if(state==='0')
            return <p>{'已经筹集:'+now+' wei'}</p>
        else if(state==='1')
            return <p>众筹失败</p>
        else
            return <p>众筹成功</p>
    }

    getdescription=(time,money,state,now)=>{
        return(
            <div>
                <p>{"截至时间:"+time}</p>
                <p>{'目标金额:'+money+' wei'}</p>
                {this.baseonstate(state,now)}
            </div>
        )
    }

    render() {
        return(
            <div class="lay">
                <h1>我发起的项目</h1>
                <List
                    grid={{gutter: 16, column: 4}}
                    dataSource={this.state.allprojects}
                    pagination={{
                    pageSize: 8,
                    }}
                    renderItem={item => (
                    <List.Item>
                        <Link  to={{pathname:this.getitempath(item.id.toString())}}>
                            <Card hoverable style={{ width: 200 }} cover={<img src={picurl} alt='logo'/>}>
                                <Meta title={item.title} description={this.getdescription(item.time,item.money,item.state,item.nowmoney)} />
                            </Card>
                        </Link>
                    </List.Item>
                    )}
                />
            </div>
        )
    }
}

export default myProject;