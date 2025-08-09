import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  message,
  Space,
  Tag
} from 'antd';
import moment from 'moment';

const { Option } = Select;

const ContractList = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingContract, setEditingContract] = useState(null);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/contracts');
      setContracts(response.data);
    } catch (error) {
      message.error('Failed to fetch contracts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (values) => {
    try {
      await axios.post('/api/contracts', values);
      message.success('Contract created successfully');
      setModalVisible(false);
      form.resetFields();
      fetchContracts();
    } catch (error) {
      message.error('Failed to create contract');
    }
  };

  const handleUpdate = async (values) => {
    try {
      await axios.put(`/api/contracts/${editingContract.id}`, values);
      message.success('Contract updated successfully');
      setModalVisible(false);
      setEditingContract(null);
      form.resetFields();
      fetchContracts();
    } catch (error) {
      message.error('Failed to update contract');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/contracts/${id}`);
      message.success('Contract deleted successfully');
      fetchContracts();
    } catch (error) {
      message.error('Failed to delete contract');
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === 'employment' ? 'blue' : 'green'}>
          {type.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={
          status === 'active' ? 'green' :
          status === 'pending' ? 'orange' :
          status === 'expired' ? 'red' :
          'default'
        }>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date) => moment(date).format('YYYY-MM-DD'),
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (date) => moment(date).format('YYYY-MM-DD'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => {
            setEditingContract(record);
            form.setFieldsValue({
              ...record,
              startDate: moment(record.startDate),
              endDate: moment(record.endDate),
            });
            setModalVisible(true);
          }}>
            Edit
          </Button>
          <Button danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          setEditingContract(null);
          form.resetFields();
          setModalVisible(true);
        }}
        style={{ marginBottom: 16 }}
      >
        Create Contract
      </Button>

      <Table
        columns={columns}
        dataSource={contracts}
        loading={loading}
        rowKey="id"
      />

      <Modal
        title={editingContract ? 'Edit Contract' : 'Create Contract'}
        visible={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingContract(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={editingContract ? handleUpdate : handleCreate}
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please input the title!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true, message: 'Please select the type!' }]}
          >
            <Select>
              <Option value="employment">Employment</Option>
              <Option value="service">Service</Option>
              <Option value="vendor">Vendor</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select the status!' }]}
          >
            <Select>
              <Option value="draft">Draft</Option>
              <Option value="pending">Pending</Option>
              <Option value="active">Active</Option>
              <Option value="expired">Expired</Option>
              <Option value="terminated">Terminated</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="startDate"
            label="Start Date"
            rules={[{ required: true, message: 'Please select the start date!' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="endDate"
            label="End Date"
            rules={[{ required: true, message: 'Please select the end date!' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingContract ? 'Update' : 'Create'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ContractList; 