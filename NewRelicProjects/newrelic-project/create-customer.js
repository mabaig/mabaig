var newrelic = require('newrelic');
const logger = require('./logger');

const stripe = require('stripe')('sk_test_place your own stripe secret key');

async function createCustomerPaymentMethod() {

    try {

        logger.winstonLogger.log('info', 'Started creating customer');

        const customer = await stripe.customers.create({
            description: 'Test Customer 6oct 2(created for API docs)',
            email: "m.baig162@gmail.com",
            name: "Demo Customer Newrelic"
        });

        logger.winstonLogger.log('info', 'Customer:' + JSON.stringify(customer));
        logger.winstonLogger.log('info', 'Customer created with id' + customer.id);

        const paymentMethod = await stripe.paymentMethods.create({
            type: 'card',
            card: {
                number: '4242424242424242',
                exp_month: 4,
                exp_year: 2023,
                cvc: '314',
            },
        });

        logger.winstonLogger.log('info', 'Payment method id' + paymentMethod.id);

        const paymentMethodMapping = await stripe.paymentMethods.attach(
            paymentMethod.id,
            { customer: customer.id }
        );

        logger.winstonLogger.log('info', 'Payment method id' + paymentMethod.id);
    } catch (err) {
        logger.winstonLogger.log('error', 'Error Code:' + err.error);
        logger.winstonLogger.log('error', 'Error Message:' + err.message);

    }
}

createCustomerPaymentMethod();