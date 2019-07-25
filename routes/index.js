var express = require('express');
var router = express.Router();
const Memo = require('../models/memo');

/* GET home page. */
router.get('/', function (req, res, next) {
  const title = '安値メモ';
  if (req.user) {
    Memo.findAll({
      where: {
        createdBy: req.user.id
      },
      order: [['"updatedAt"', 'DESC']]
    }).then((memos) => {
      res.render('index', {
        title: title,
        user: req.user,
        memos: memos
      });
    });
  } else {
    res.render('index', { title: title, user: req.user });
  }
});

module.exports = router;
