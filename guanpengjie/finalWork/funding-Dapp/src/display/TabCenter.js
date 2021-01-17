import React from 'react';
import { Tab } from 'semantic-ui-react';
import AllFundingTab from './allFundingTab/AllFundingTab';
import SupportFundingTab from "./supporterFundingTab/SupportFundingTab";
import CreatorFundingTab from "./creatorFundingTab/CreatorFundingTab";

const panes = [
    { menuItem: 'Tab 1', render: () => <Tab.Pane><AllFundingTab /></Tab.Pane> },
    { menuItem: 'Tab 2', render: () => <Tab.Pane><CreatorFundingTab /></Tab.Pane> },
    { menuItem: 'Tab 3', render: () => <Tab.Pane><SupportFundingTab/> </Tab.Pane> },
]

const TabCenter = () => <Tab panes={panes} />

export default TabCenter

