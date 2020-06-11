'use strict';
const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
const uuid = require('uuid').v4;

const postsTable = process.env.POSTS_TABLE;

function response(statusCode, message) {
  return {
    statusCode: statusCode,
    body: JSON.stringify(message),
  };
}

module.exports.createPost = async (event, context, callback) => {
  const reqBody = JSON.parse(event.body);

  const date = new Date();

  const post = {
    id: uuid(),
    userId: 1,
    createdAt: date.toISOString(),
    title: reqBody.title,
    body: reqBody.body,
  };

  return db
    .put({
      TableName: postsTable,
      Item: post,
    })
    .promise()
    .then(() => {
      callback(null, response(201, post));
    })
    .catch((err) => response(null, response(err.statusCode, err)));
};

module.exports.getPost = async (event, context, callback) => {
  return db
    .scan({ TableName: postsTable })
    .promise()
    .then((res) => {
      callback(null, response(200, res.Items));
    })
    .catch((err) => response(null, response(err.statusCode, err)));
};
