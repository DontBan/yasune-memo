'use strict';
const request = require('supertest');
const app = require('../app');
const passportStub = require('passport-stub');
const User = require('../models/user');
const Memo = require('../models/memo');

describe('/login', () => {
  before(() => {
    passportStub.install(app);
    passportStub.login({ username: 'testuser' });
  });

  after(() => {
    passportStub.logout();
    passportStub.uninstall(app);
  });

  it('ログインのためのリンクが含まれる', (done) => {
    request(app)
      .get('/login')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(/<a href="\/auth\/github"/)
      .expect(200, done);
  });

  it('ログイン時にはユーザー名が表示される', (done) => {
    request(app)
      .get('/login')
      .expect(/testuser/)
      .expect(200, done);
  });

});

describe('/logout', () => {
  it('/ にリダイレクトされる', (done) => {
    request(app)
      .get('/logout')
      .expect('Location', '/')
      .expect(302, done);
  });
});

describe('/memos', () => {
  before(() => {
    passportStub.install(app);
    passportStub.login({ id: 0, username: 'testuser' });
  });

  after(() => {
    passportStub.logout();
    passportStub.uninstall(app);
  });

  it('予定が作成でき、表示される', (done) => {
    User.upsert({ userId: 0, username: 'testuser' }).then(() => {
      request(app)
        .post('/memos')
        .send({ productName: 'テストメモ1', price: 108, shopName: 'いなげや', remarks: 'セール中' })
        .expect('Location', /memos/)
        .expect(302)
        .end((err, res) => {
          const createdMemoPath = res.headers.location;
          request(app)
            .get(createdMemoPath)
            .expect(/テストメモ1/)
            .expect(/108/)
            .expect(/いなげや/)
            .expect(/セール中/)
            .expect(200)
            .end((err, res) => {
              if (err) return done(err);
              // テストで作成したデータを削除
              const memoId = createdMemoPath.split('/memos/')[1];
              Memo.findByPk(memoId).then((m) => {
                m.destroy().then(() => {
                  done();
                });
              });
            });
        });
    });
  });
});