import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Card,
  Descriptions,
  Upload,
  Button,
  List,
  Timeline,
  Form,
  Input,
  message,
  Space,
  Tag,
  Avatar
} from 'antd';
import { UploadOutlined, PaperClipOutlined, UserOutlined } from '@ant-design/icons';
import moment from 'moment';

const { TextArea } = Input;

const ContractDetail = () => {
  const { id } = useParams();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [commentForm] = Form.useForm();

  useEffect(() => {
    fetchContractDetails();
  }, [id]);

  const fetchContractDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/contracts/${id}`);
      setContract(response.data);
    } catch (error) {
      message.error('Failed to fetch contract details');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', file.name);
      formData.append('fileType', file.type);
      formData.append('fileSize', file.size);

      await axios.post(`/api/contracts/${id}/attachments`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      message.success('File uploaded successfully');
      fetchContractDetails();
    } catch (error) {
      message.error('Failed to upload file');
    }
  };

  const handleCommentSubmit = async (values) => {
    try {
      await axios.post(`/api/contracts/${id}/comments`, values);
      message.success('Comment added successfully');
      commentForm.resetFields();
      fetchContractDetails();
    } catch (error) {
      message.error('Failed to add comment');
    }
  };

  if (!contract) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Card title="Contract Details" loading={loading}>
        <Descriptions bordered>
          <Descriptions.Item label="Title">{contract.title}</Descriptions.Item>
          <Descriptions.Item label="Type">
            <Tag color={contract.type === 'employment' ? 'blue' : 'green'}>
              {contract.type.toUpperCase()}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={
              contract.status === 'active' ? 'green' :
              contract.status === 'pending' ? 'orange' :
              contract.status === 'expired' ? 'red' :
              'default'
            }>
              {contract.status.toUpperCase()}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Start Date">
            {moment(contract.startDate).format('YYYY-MM-DD')}
          </Descriptions.Item>
          <Descriptions.Item label="End Date">
            {moment(contract.endDate).format('YYYY-MM-DD')}
          </Descriptions.Item>
          <Descriptions.Item label="Created By">
            {contract.createdBy.name}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Attachments" style={{ marginTop: 16 }}>
        <Upload
          customRequest={({ file }) => handleFileUpload(file)}
          showUploadList={false}
        >
          <Button icon={<UploadOutlined />}>Upload File</Button>
        </Upload>

        <List
          dataSource={contract.contractAttachments}
          renderItem={attachment => (
            <List.Item>
              <List.Item.Meta
                avatar={<PaperClipOutlined />}
                title={attachment.fileName}
                description={`${attachment.fileType} - ${(attachment.fileSize / 1024).toFixed(2)} KB`}
              />
            </List.Item>
          )}
        />
      </Card>

      <Card title="Comments" style={{ marginTop: 16 }}>
        <Form form={commentForm} onFinish={handleCommentSubmit}>
          <Form.Item name="comment" rules={[{ required: true }]}>
            <TextArea rows={4} placeholder="Add a comment..." />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Comment
            </Button>
          </Form.Item>
        </Form>

        <List
          className="comment-list"
          itemLayout="horizontal"
          dataSource={contract.contractComments}
          renderItem={comment => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar icon={<UserOutlined />} />}
                author={comment.user.name}
                content={comment.comment}
                description={moment(comment.createdAt).format('YYYY-MM-DD HH:mm')}
              />
            </List.Item>
          )}
        />
      </Card>

      <Card title="History" style={{ marginTop: 16 }}>
        <Timeline>
          {contract.contractHistories.map(history => (
            <Timeline.Item key={history.id}>
              <p>
                <strong>{history.changedBy.name}</strong> {history.changeType}d
                {history.fieldName !== 'all' && ` the ${history.fieldName}`}
              </p>
              <p>{moment(history.createdAt).format('YYYY-MM-DD HH:mm')}</p>
            </Timeline.Item>
          ))}
        </Timeline>
      </Card>
    </div>
  );
};

export default ContractDetail; 