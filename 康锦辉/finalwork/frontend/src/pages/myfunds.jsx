import React from 'react';
import '../styles/myfunds.scss';

let web3 = require('../backend/web3');
let contract = require('../backend/contract');

class MyFunds extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            indices: [],
            my_funds: [],
            active: -1,
            reqs: []
        }
    }

    get_myfunds = async() =>{
        let accounts = await web3.eth.getAccounts();
        try{
            let num = await contract.methods.userFundsLen(accounts[0]).call();
            console.log('funds num:', num);    
            let indices = [];
            for(let i=0; i<num; i++){
                let index = await contract.methods.userFunds(accounts[0], i).call();
                indices.push(index);
            }
            let prods = [];
            for(let i=0; i<num; i++){
                let p = await contract.methods.products(indices[i]).call();
                prods.push(p);
            }
            console.log('funds:', prods);
            this.setState({
                indices: indices,
                my_funds: prods
            })
        }catch(e){
            console.log(e);
        }
    }

    get_requests = async(index) => {
        try{
            let num = await contract.methods.reqNums(index).call();
            console.log('req num:', num);
            let arr = [];
            for(let i=0; i<num; i++){
                let r = await contract.methods.requests(index, i).call()
                arr.push(r);
            }
            console.log('reqs:', arr);
            this.setState({
                active: index,
                reqs: arr
            })
        }catch(e){

        }
    }

    agree = async(ind_p, ind_r) =>{
        let accounts = await web3.eth.getAccounts();
        try {
            await contract.methods.agree(ind_p, ind_r).send({
                from: accounts[0],
                //value: web3.utils.toWei(String(money), 'ether'),
                gas: '3000000',
            })
            window.location.reload()
            this.setState({ isClicked: false })
            alert('agree success!');
        } catch (e) {
            console.log(e)
            this.setState({ isClicked: false })
            alert('failed!\nyou may have already agreed');
        }
    }

    show(){
        //console.log('show myfunds', this.state.my_funds);
        return(
            <div className='funds'>
                total: {this.state.my_funds.length}
                {this.state.my_funds.map((item, index)=>{
                    return (
                        <div className='fund' key={index}>
                            <div className='fund-info'>
                                <div className='infos'>
                                    product: {this.state.indices[index]} goal: {item[1]} current: {item[2]}
                                </div>

                                {item['finished'] &&
                                <button className='btn-show-req' 
                                onClick={()=>{
                                    this.get_requests(this.state.indices[index]);
                                }}>
                                    show use requests
                                </button>}
                            </div>
                            
                            {this.state.indices[index] === this.state.active &&
                            <div className='reqs'>
                                {this.state.reqs.map((elem, ind)=>{
                                    return(
                                        <div className='req' key={ind}>
                                            <div className='info'>
                                                <div className='info-item'>amount: {elem['amount']} </div>
                                                <div>progress: {elem['progress']}%</div>
                                            </div>

                                            {elem['passed']===false &&
                                            <button className='btn-agree'
                                            onClick={()=>{
                                                this.agree(this.state.indices[index], ind);
                                            }}>
                                                agree
                                            </button>
                                            }
                                            {elem['passed'] &&
                                            <div className='passed'>
                                                passed
                                            </div>
                                            }
                                        </div>
                                    )
                                })}
                            </div>}
                            
                        </div>
                    )
                })}
            </div>
        )
    }

    render(){
        return(
            <div className='myfunds'>
                <button onClick={this.get_myfunds}>my funds</button>
                {this.show()}
            </div>
        )
    }
}

export default MyFunds;