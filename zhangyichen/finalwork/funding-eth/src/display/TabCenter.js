import React from 'react';
import { Tab } from 'semantic-ui-react';
import AllFundingTab from './AllFundingTab';
import CreatorFundingTab from './CreateFundingTab';
import InvolveFundingTab from './InvolveFundingTab';

const panes = [
    { menuItem: '所有的', render: () => <Tab.Pane><AllFundingTab/></Tab.Pane> },
    { menuItem: '我发起的', render: () => <Tab.Pane><CreatorFundingTab/></Tab.Pane> },
    { menuItem: '我参与的', render: () => <Tab.Pane><InvolveFundingTab/></Tab.Pane> },
]
 
const TabCenter = () => <Tab panes={panes} />
 
export default TabCenter