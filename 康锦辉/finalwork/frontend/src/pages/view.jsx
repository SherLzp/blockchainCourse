import React from 'react';
import '../styles/view.scss';
import { InputNumber } from 'antd';

let web3 = require('../backend/web3');
let contract = require('../backend/contract');

class View extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            productsNum: 0,
            products: [],
            moneys: []
        }
    }
    view = async() => {
        try{
            let num = await contract.methods.productsNum().call();
            console.log(num);
            
            let prods = [];
            let arr = [];
            for(let i=0; i<num; i++){
                let p = await contract.methods.products(i).call();
                console.log(p);
                prods.push(p);
                arr.push(1);
            }

            this.setState({
                productsNum: num,
                products: prods,
                moneys: arr
            });
        }catch(e){

        }
    }
    async vote(index){
        let money = this.state.moneys[index];
        console.log('vote: ', money);
        let accounts = await web3.eth.getAccounts();
        try {
            await contract.methods.vote(index).send({
                from: accounts[0],
                value: web3.utils.toWei(String(money), 'ether'),
                gas: '3000000',
            })
            window.location.reload()
            this.setState({ isClicked: false })
            alert('vote success!');
        } catch (e) {
            console.log(e)
            this.setState({ isClicked: false })
            alert('failed!');
        }
    }
    
    num_input_change(index, value){
        let arr = this.state.moneys;
        arr[index] = value;
        this.setState({
            moneys: arr
        });
    }

    tiemstamp2time(stamp){
        console.log(stamp);
        let time = new Date(parseInt(stamp));
        let Y = time.getFullYear();
        let M = time.getMonth()+1 < 10 ? '0'+(time.getMonth()+1) : time.getMonth()+1;
        let D = time.getDate();
        let h = time.getHours();
        let m = time.getMinutes()<10 ? '0'+time.getMinutes() : time.getMinutes();
        let s = time.getSeconds()<10 ? '0'+time.getSeconds() : time.getSeconds(); 
        return Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s;
    }

    is_expired(stamp){
        let now = new Date().getTime();
        return stamp < now;
    }

    get_prods(){
        console.log(this.state.products);
        
        return(
            <div class='products'>
                {this.state.products.map((item, index) => {
                    return(
                        <div class='product' key={index}>
                            <div className='info'>
                                <div>product {index} </div>
                                <div>goal: {item[1]} </div>
                                <div>current: {item[2]}</div>
                                <div>deadline: {this.tiemstamp2time(item['ddl'])}</div>
                                {this.is_expired(item['ddl']) && <div>Expired</div>}
                                {item['finished'] && <div>finished</div>}
                            </div>
                            
                            {this.is_expired(item['ddl'])===false &&
                            item['finished']===false &&
                            <div className='vote'>
                                <InputNumber id='num-input' size='small' 
                                    className='number-input' 
                                    min={1} max={item[1]-item[2]} defaultValue={1}
                                    onChange={(value)=>{
                                        this.num_input_change(index, value);
                                    }
                                }/>

                                <button class='btn-vote' 
                                    onClick={()=>{
                                        this.vote(index);
                                    }}>
                                    vote
                                </button>
                            </div>
                            }
                        </div>
                    )} 
                )}
            </div>
        );
    }
    render(){
        return(
            <div class='view'>
                <button onClick={this.view}>view</button>
                <div>number of products: {this.state.productsNum}</div>
                {this.get_prods()}
            </div>
        );
    }
}

export default View;