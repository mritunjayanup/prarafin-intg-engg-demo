## Prerequisites

- Access to a [Parafin dashboard](https://dashboard.parafin.com)
- [Node.js](https://nodejs.org/en/)

## Instructions

### 1. Clone repo

First, clone the quickstart repository and install dependencies:

```bash
$ git clone https://github.com/buildparafin/embedded-demo.git
$ cd embedded-demo
$ npm install
```

### 2. Fetch and include API keys

Next, Navigate to the [Settings > API keys](https://dashboard.parafin.com/settings/api-keys) in your Parafin dashboard and fetch your sandbox Client ID and Client secret.

Rename the `sample.env` file to `.env` and populate with your Client ID and Client secret.

```bash
$ mv sample.env .env
```

```bash
# .env
PARAFIN_CLIENT_ID="<your-client-id>"
PARAFIN_CLIENT_SECRET="<your-client-secret>"
```

### 3. Create a pre-approved offer

There are a few requirements before you can display a pre-approved offer with @parafin/react:

- Create a [Business](https://docs.parafin.com/api#tag/Businesses/operation/Create%20Business), [Person](https://docs.parafin.com/api#tag/Persons/operation/Create%20Person), and [Bank Account](https://docs.parafin.com/api#tag/Bank-Accounts/operation/Create%20Bank%20Account)
- [Generate a Capital Product Offer](https://docs.parafin.com/api#tag/Capital-Product-Offers/operation/Create%20Capital%20Product%20Offer%20(Sandbox)) for the newly created Business
- Replace the `personId` in the `App.js` file with the ID from your newly created Person (`person_xxx`)
- Replace `business_parafin_id` in the `server.js` file file with the ID from your newly created Business/your selected business (`business_xxx`)

### 4. Run the app

You're now ready to run the app and check out your embedded offer!

In the project directory, run:

```bash
$ npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app with an embedded Parafin Widget in your browser.

### 5. Business Offer flow Demo:
- 1. No offer: Landing page
- 2. Pre-Approved Offer: View the pre-approved offer created for your business.
        To Create a demo offer for your business in sanfdbox use [ Create Capital Product Offer (Sandbox)](https://docs.parafin.com/api#tag/Capital-Product-Offers/operation/Create%20Capital%20Product%20Offer%20(Sandbox)), `business_parafin_id` is the id of your business.
- 3. Capital On Way: Once you land to youe per-approved offer page you would need to verify your bank account you created and linked to your business. To do so in the sandbox environment use [Verify Bank Account (Sandbox)](https://docs.parafin.com/api#tag/Bank-Accounts/operation/Verify%20Bank%20Account%20(Sandbox)), get the back account id (`bank_account_xxx`)
- 4. Accept offer/Outstanding Balance: To move forward to Outstanding balance (payment in progress) in the sandbox environment use [Fund Capital Product](https://docs.parafin.com/api#tag/Sandbox/operation/Fund%20Capital%20Product), `business_parafin_id` is the id of your business.