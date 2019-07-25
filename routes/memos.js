'use strict';
const express = require('express');
const router = express.Router();
const authenticationEnsurer = require('./authentication-ensurer');
const uuid = require('uuid');
const Memo = require('../models/memo');
const User = require('../models/user');

router.get('/new', authenticationEnsurer, (req, res, next) => {
  res.render('new', { user: req.user });
});

router.post('/', authenticationEnsurer, (req, res, next) => {
  // console.log(req.body);
  // res.redirect('/');

  const memoId = uuid.v4();
  const updatedAt = new Date();
  Memo.create({
    memoId: memoId,
    productName: req.body.productName.slice(0, 255),
    price: req.body.price,
    shopName: req.body.shopName.slice(0, 255),
    remarks: req.body.remarks.slice(0, 255),
    createdBy: req.user.id,
    updatedAt: updatedAt
  }).then((memo) => {
    res.redirect('/memos/' + memo.memoId);
  });
});

router.get('/:memoId', authenticationEnsurer, (req, res, next) => {
  Memo.findOne({
    include: [
      {
        model: User,
        attributes: ['userId', 'username']
      }
    ],
    where: {
      memoId: req.params.memoId
    },
    order: [['"updatedAt"', 'DESC']]
  }).then((memo) => {
    if (memo) {
      res.render('memo', {
        user: req.user,
        memo: memo
      });
    } else {
      const err = new Error('指定されたメモは見つかりません');
      err.status = 404;
      next(err);
    }
  });
});

module.exports = router;