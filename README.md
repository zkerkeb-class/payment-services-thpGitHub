# Service de Paiement

Service de paiement basé sur Stripe pour gérer les transactions.

## Prérequis

- Node.js
- Compte Stripe
- ngrok (pour les webhooks en dev)

## Installation

```bash
npm install
cp .env.example .env
```

## Configuration

1. **Créer un compte Stripe**
   - Inscription sur [stripe.com](https://stripe.com)
   - Récupérer la clé secrète (`sk_test_...`) dans Développeurs > Clés API

2. **Configurer le .env**
   ```env
   PORT=3000
   STRIPE_SECRET_KEY=sk_test_votre_cle
   STRIPE_WEBHOOK_SECRET=whsec_votre_webhook_secret
   ```

3. **Configuration de ngrok (dev)**
   
   Ngrok est nécessaire en développement pour que Stripe puisse envoyer des webhooks à votre machine locale.
   À chaque session de développement, vous devrez :

   ```bash
   # Installation (une seule fois)
   npm install -g ngrok

   # Configuration (une seule fois)
   # 1. Créer un compte sur https://dashboard.ngrok.com/signup
   # 2. Récupérer votre authtoken sur https://dashboard.ngrok.com/get-started/your-authtoken
   ngrok config add-authtoken votre_authtoken

   # Lancer le tunnel (à chaque session de dev)
   ngrok http 3000
   ```

   ⚠️ **Important** : 
   - À chaque démarrage de ngrok, vous obtiendrez une nouvelle URL (ex: https://abc123.ngrok-free.app)
   - Cette URL change à chaque redémarrage en plan gratuit
   - Gardez la fenêtre ngrok ouverte pendant le développement

4. **Configuration des Webhooks Stripe**
   
   Dans le dashboard Stripe (à refaire à chaque nouvelle URL ngrok) :
   - Aller dans Développeurs > Webhooks > Ajouter endpoint
   - URL : `votre_url_ngrok/api/payments/webhook` (ex: https://abc123.ngrok-free.app/api/payments/webhook)
   - Événements à sélectionner :
     - payment_intent.succeeded
     - payment_intent.payment_failed
   - Copier le Webhook Secret (whsec_...) généré dans votre `.env`

## Démarrage

```bash
# Mode développement
npm run dev

# Production
npm start
```

## Endpoints

- `POST /api/payments/create-payment-intent`
  - Body: `{ amount: number, currency?: string }`
  - Crée une intention de paiement

- `POST /api/payments/webhook`
  - Endpoint pour les webhooks Stripe
  - Gère les notifications de paiement

## Notes pour la Production

En production :
- Pas besoin de ngrok
- URL fixe de votre API (ex: api.votreservice.com)
- Configuration unique du webhook Stripe avec l'URL de production

## Prix Stripe

- Mode Test : Gratuit
- Production : 
  - 1.4% + 0.25€ (cartes EU)
  - 2.9% + 0.25€ (cartes non-EU)
  - Pas de frais fixes/abonnement 