import React, {Component} from 'react';
import { Table, Tag, Typography } from 'antd';
import Contribute from './Contribute';
import CreateDraw from './CreateDraw';

const { Title, Paragraph, Text, Link } = Typography;

class ProjectTable extends Component{
  constructor(){
    super();
    this.state = {
      columns: [],
    };
  }

  componentDidMount(){
    this.setState({
      columns: [
        { title: 'Title',
          dataIndex: 'projectTitle', 
          key: 'projectTitle',
          render: (text, record, index) => {
            const url = '/project/' + (record.key - 1);
            return (
              <a href={url}>{text}</a>
            );
          }
        },
        { title: 'Target', dataIndex: 'projectTarget_eth', key: 'projectTarget_eth' },
        { title: 'Total', dataIndex: 'projectTotal_eth', key: 'projectTotal_eth' },
        { title: 'Your Contribution', dataIndex: 'projectContribution_eth', key: 'projectContribution_eth'},
        { title: 'Start Time', dataIndex: 'projectStartTime', key: 'projectStartTime' },
        { title: 'Deadline', dataIndex: 'projectDeadline', key: 'projectDeadline' },
        { title: 'State', 
          dataIndex: 'projectState', 
          key: 'projectState',
          render: (text) => {
            let color = 'geekblue';
            if (text === "Ongoing") color = 'green';
            else if (text === "Failed") color = 'volcano';
            else if (text === "Succeeded") color = 'geekblue';
            else if (text === "Paidoff") color = 'gold';
            return (
              <Tag color={color} key={text}>
                {text}
              </Tag>
            );
          },
        },
        {
          title: 'Action',
          dataIndex: '',
          key: 'x',
          render: (text, record, index) => {
            if (this.props.currentAccount === record.projectCreator){
              if (record.projectState === "Ongoing") return (<></>);
              else if (record.projectState === "Failed") return (<></>);
              else if (record.projectState === "Succeeded") return (
                <CreateDraw
                  index={index}
                  createDraw={this.props.createDraw}
                ></CreateDraw>
              );
              else if (record.projectState === "Paidout") return (<></>);
            } else {
              if (record.projectState === "Ongoing") return (
                <Contribute
                  index={index}
                  contribute={this.props.contribute}
                ></Contribute>
              );
              else if (record.projectState === "Failed") return (<></>);
              else if (record.projectState === "Succeeded") return (<></>);
              else if (record.projectState === "Paidout") return (<></>);
            }
          },
        },
      ],
    });
  }

  render(){
    return (
      <Table
        columns={this.state.columns}
        expandable={{
          expandedRowRender: record => <div>
              <Typography>
                <Paragraph>
                  <Text strong>Title:</Text> {record.projectTitle}
                </Paragraph>
                <Paragraph>
                  <Text strong>State:</Text> {record.projectState}
                </Paragraph>
                <Paragraph>
                  <Text strong>Target Amount:</Text> {record.projectTarget_eth} ({record.projectTarget})
                </Paragraph>
                <Paragraph>
                  <Text strong>Total Raised Amount:</Text> {record.projectTotal_eth} ({record.projectTotal})
                </Paragraph>
                <Paragraph>
                  <Text strong>Fund Balance:</Text> {record.projectBalance_eth} ({record.projectBalance})
                </Paragraph>
                <Paragraph>
                  <Text strong>Your Contribution:</Text> {record.projectContribution_eth} ({record.projectContribution})
                </Paragraph>
                <Paragraph>
                  <Text strong>Project Start Time:</Text> {record.projectStartTime}
                </Paragraph>
                <Paragraph>
                  <Text strong>Raising Deadline:</Text> {record.projectDeadline}
                </Paragraph>
                <Paragraph>
                  <Text strong>Raising Complete Time:</Text> {record.projectCompleteTime}
                </Paragraph>
                <Paragraph>
                  <Text strong>Project End Time:</Text> {record.projectEndTime}
                </Paragraph>
                <Paragraph>
                  <Text strong>Description:</Text> {record.projectDescription}
                </Paragraph>
              </Typography>
            </div>,
        }}
        dataSource={this.props.projectsInfo}
      />
    )
  }
};

export default ProjectTable;