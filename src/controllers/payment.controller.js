const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class PaymentController {
    static async createPaymentIntent(req, res) {
        try {
            const { amount, currency = 'eur' } = req.body;

            if (!amount) {
                return res.status(400).json({ error: 'Le montant est requis' });
            }

            const paymentIntent = await stripe.paymentIntents.create({
                amount,
                currency,
                automatic_payment_methods: {
                    enabled: true,
                },
            });

            res.json({
                clientSecret: paymentIntent.client_secret,
            });
        } catch (error) {
            console.error('Erreur lors de la création du PaymentIntent:', error);
            res.status(500).json({ error: 'Erreur lors de la création du paiement' });
        }
    }

    static async handleWebhook(req, res) {
        const sig = req.headers['stripe-signature'];

        try {
            const event = stripe.webhooks.constructEvent(
                req.body,
                sig,
                process.env.STRIPE_WEBHOOK_SECRET
            );

            switch (event.type) {
                case 'payment_intent.succeeded':
                    const paymentIntent = event.data.object;
                    console.log('PaymentIntent réussi:', paymentIntent.id);
                    break;
                case 'payment_intent.payment_failed':
                    const failedPayment = event.data.object;
                    console.log('Paiement échoué:', failedPayment.id);
                    break;
                default:
                    console.log(`Type d'événement non géré: ${event.type}`);
            }

            res.json({ received: true });
        } catch (err) {
            console.error('Erreur webhook:', err.message);
            res.status(400).send(`Webhook Error: ${err.message}`);
        }
    }
}

module.exports = PaymentController; 