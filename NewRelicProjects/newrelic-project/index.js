const newrelic = require('newrelic');
const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
const logger = require('./logger');


const port = process.env.PORT || 3000
var Publishable_Key = 'pk_test_place your own stripe publishable key'
var Secret_Key = 'sk_test_place your own stripe secret key'
const stripe = require('stripe')(Secret_Key)

const app = express()
app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())

logger.winstonLogger.log('info', 'Started the payment app.');

logger.winstonLogger.log('info', 'new relic agent loaded.');

// View Engine Setup 
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
	res.render('Home', {
		key: Publishable_Key
	})
})

app.post('/payment', function (req, res) {

	stripe.customers.create({
		email: req.body.stripeEmail,
		source: req.body.stripeToken,
		name: 'Baig Mohammed',
		address: {
			line1: '17776 NE 90 St',
			postal_code: '98052',
			city: 'Redmond',
			state: 'WA',
			country: 'USA',
		}
	})
		.then((customer) => {
			logger.winstonLogger.log('info', 'Customer created. Customer id [' + customer.id + ']');

			return stripe.charges.create({
				amount: 10000,
				description: 'Web Product',
				currency: 'USD',
				customer: customer.id
			});
		})
		.then((charge) => {
			logger.winstonLogger.log('error', 'Charges creation failed for charge id [' + charge.id + ']');

			res.send("Success")
		})
		.catch((err) => {
			logger.winstonLogger.log('error', 'API Error:' + err);
			res.send(err)
		});
})

app.listen(port, function (error) {
	if (error) throw error
	logger.winstonLogger.log('info', 'Server created Successfully');
}) 
