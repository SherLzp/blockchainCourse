import React from 'react';
import { Tab }  from 'semantic-ui-react';
import AllFunding from './AllFunding';
import InvestFunding from './InvestFunding';
import CreatorFunding from './CreatorFunding'

const panes = [
    { menuItem : '所有众筹项目', render : () => <Tab.Pane><AllFunding/></Tab.Pane> },
    { menuItem : '发起的众筹项目', render : () => <Tab.Pane><CreatorFunding/></Tab.Pane> },
    { menuItem : '参与的众筹项目', render : () => <Tab.Pane><InvestFunding/></Tab.Pane> },
    
]

const DappCenter = () => <Tab panes = {panes}/>

export default DappCenter