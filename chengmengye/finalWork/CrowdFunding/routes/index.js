var express = require('express');
var router = express.Router();
var model = require('../models/models')
var web3 = require('../models/connector')

router.get('/', async function (req, res, next) {
  if (!req.session.token) {
    res.redirect('/login');
    return;
  }
});

router.get('/login', async function (req, res) {
	var users = await model.get_accounts();
	res.render('login', { users: users });
});
router.get('/fundings', async function (req, res) {
  if (!req.session.token) {
    res.redirect('/login');
    return;
  }
  let user= await model.get_cur_account(req.session.token);
  let all_fundings = await model.check_all_funding();
  let attended_fundings = await model.check_attended_funding(req.session.token);
  let created_fundings = await model.check_created_funding(req.session.token);
  res.render('fundings', {
    user:user,
    all_fundings: all_fundings,
    attended_fundings: attended_fundings,
    created_fundings: created_fundings
  });
});
router.get('/details', async function (req, res) {
  if (!req.session.token) {
    res.redirect('/login');
    return;
  }
  else {
    let funding = await model.transfer_funding(req.query.addr);
    funding.requests = await model.check_request(req.query.addr);
    let privilege = await model.check_if_attended(req.session.token, req.query.addr);
    let users = await model.get_accounts();
    res.render('details', {
      funding: funding,
      privilege: privilege,
      users:users
    });
  }
})
router.post('/login', async function (req, res) {
	var userIndex = parseInt(req.body.index);
	var users = await model.get_accounts();
	if (userIndex >= 0 && userIndex < users.length) {
		req.session.token = users[userIndex];
		res.send({ status: 1 });
	} else {
		res.send({ status: 0, msg: 'Invalid User Index!' });
	}
});

router.post('/createFunding', async function (req, res, next) {
  try {
    await model.create_funding(req.body,req.session.token);
    res.send({ status: 1 }).end();
  } catch (err) {
    res.send({ status: 0, msg: err.message }).end();
  }
})

router.post('/attendFunding', async function (req, res, next) {
  try {
    await model.attend_funding(req.session.token,web3.toWei(req.body.money,'ether'),req.body.address); 
    res.send({ status: 1 }).end();
  } catch (err) {
    res.send({ status: 0 ,msg:err.message}).end();
  }
})

router.post('/createRequest', async function (req, res, next) {
  try {
    await model.create_request(req.session.token,req.body,req.body.funding_addr);
    res.send({ status: 1 }).end();
  } catch (err) {
    console.log(req.body)
    console.log(err)
    res.send({ status: 0, msg: err.message }).end();
  }
})

router.post('/approveRequest', async function (req, res, next) {
  try {
    await model.approve_request(req.session.token,req.body.index,req.body.address);
    res.send({ status: 1 }).end();
  } catch (err) {
    res.send({ status: 0, msg: err.message }).end();
  }
})

router.post('/denyRequest', async function (req, res, next) {
  try {
    await model.deny_request(req.session.token,req.body.index,req.body.address);
    res.send({ status: 1 }).end();
  } catch (err) {
    res.send({ status: 0, msg: err.message }).end();
  }
})

router.post('/executeRequest', async function (req, res, next) {
  try {
    await model.execute_request(req.session.token,req.body.index,req.body.address);
    res.send({ status: 1 }).end();
  } catch (err) {
    res.send({ status: 0, msg: err.message }).end();
  }
})


router.post('/refund', async function (req, res, next) {
  try {
    await model.refund(req.session.token, '0x' + req.body.address);
    res.send({ status: 1 }).end();
  } catch (err) {
    res.send({ status: 0, msg: err.message }).end();
  }
})
module.exports = router;
