const postOrder = require('./postOrder');
const sendCode = require('./autCodeController');
const verifyCode = require('./verifyCodeController');
const getOrderBySlug =require('./getOrderBySlugController');
const getDatauser = require('./getUserFullDataController')

module.exports = {postOrder,sendCode ,verifyCode ,getOrderBySlug ,getDatauser};