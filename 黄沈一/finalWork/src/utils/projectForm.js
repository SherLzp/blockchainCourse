import React, { Component } from 'react'
import '../App.css'
import ProjectList from '../components/projectDetail'
import createProject from './createProject'
import { useState } from 'react';
import { Modal, Button, Form, Input, InputNumber } from 'antd';
import { Row, Col } from 'antd';

// for the form
const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };
  const validateMessages = {
    required: '${label} is required!',
    types: {
      email: '${label} is not a valid email!',
      number: '${label} is not a valid number!',
    },
    number: {
      range: '${label} must be between ${min} and ${max}',
    },
  };
  const onFinish = (values) => {
    console.log(values);
  };
  
  class ProjectForm extends Component{
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            description: '',
            amount: 0,
            duration: 0,
        };
    }
    handleTitle = (e) => {
        this.setState({title: e.target.value},);
    }

    handleDescription = (e) => {
        this.setState({description: e.target.value});
    }

    handleAmount = (value) => {
        this.setState({amount: value});
    }

    handleDeadline = (value) => {
        this.setState({duration: value});
    }

    render() {
      return (
      <>
      <Form {...layout} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
        <Form.Item
          name={['project', 'title']}
          label="Title"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input onChange={e=>this.handleTitle(e)}/>
        </Form.Item>
        <Form.Item
          name={['project', 'duration']}
          label="Duration"
          rules={[
            {
              required: true,
              type: 'number',
              min: 0,
            },
          ]}
        >
          <InputNumber onChange={this.handleDeadline}/>
        </Form.Item>
        <Form.Item
          name={['project', 'amount']}
          label="Amount"
          rules={[
            {
              required: true,
              type: 'number',
              min: 0,
            },
          ]}
        >
          <InputNumber onChange={this.handleAmount}/>
        </Form.Item>
        <Form.Item name={['project', 'description']} label="Description">
          <Input.TextArea onChange={e=>this.handleDescription(e)}/>
        </Form.Item>
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
        </Form.Item>
      </Form>
      <Row>
      <Col span={20}>
      </Col>
      <Button type='primary' onClick={() => createProject(this.state)}>Create</Button>
      </Row>
      </>
    );
  
    }
    
  };


export default ProjectForm;