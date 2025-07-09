const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const app = express();
const axios = require("axios");
require("dotenv").config();

// middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
// session
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
  })
);

const PARAFIN_BASE_URL = "https://api.parafin.com/v1";
const PARAFIN_DEV_BASE_URL = "https://api.dev.parafin.com/v1";

// route for fetching Parafin token
app.get("/parafin/token/:id/:isDev?", async (req, res) => {
  const personId = req.params.id;
  const isDev = req.params.isDev;
  const url = `${
    isDev === "true" ? PARAFIN_DEV_BASE_URL : PARAFIN_BASE_URL
  }/auth/redeem_token`;
  console.log(personId);

  const data = {
    person_id: personId,
  };

  const config = {
    auth: {
      username: process.env.PARAFIN_CLIENT_ID,
      password: process.env.PARAFIN_CLIENT_SECRET,
    },
  };

  try {
    // make call to fetch Parafin token for business
    const result = await axios.post(url, data, config);
    const parafinToken = result.data.bearer_token;

    res.send({
      parafinToken: parafinToken,
    });
  } catch (error) {
    console.log(error.response.data);
    res.send({
      errorCode: error.response.status,
      message: error.response.data,
    });
  }
});

// Load fixture data
const noOffers = require('./fixtures/noOffer.json');
const preApproved = require('./fixtures/pre-approvedOffer.json');
// const capitalOnWay = require('./fixtures/capital-on-way.json');
const offerAccepted = require('./fixtures/offerAccepted.json');
let lastCreatedOfferId = null;
app.get('/api/mockOffers', async (req, res) => {
  const credentials = Buffer.from(`${process.env.PARAFIN_CLIENT_ID}:${process.env.PARAFIN_CLIENT_SECRET}`).toString("base64");
  const state = req.query.state;
      if (state === "no_offer") {
        res.json(noOffers);
      }
      if (state === "pre_approved") {
        try {
          const pre_approved_response = await axios.post(
            "https://api.parafin.com/v1/sandbox/capital_product_offers",
            {
              business_parafin_id: "business_657cd0f0-32c8-4e4a-86e0-53b3af2e8f26",
              product_type: "merchant_cash_advance",
              include_fee_discount: true,
              max_offer_amount: 125000
            },
            {
              headers: {
                Authorization: `Basic ${credentials}`,
                "Content-Type": "application/json"
              }
            }
          );
          const createdOffer = pre_approved_response.data;
          lastCreatedOfferId = createdOffer.id;
          console.log("Created offer id:", lastCreatedOfferId);
          console.log("Pre Approved Offer", pre_approved_response.data);
        } catch (error) {
          console.error("Error Creating capital:", error.pre_approved_response?.data || error.message);
          return res.status(500).json({ error: "Failed to create capital" });
        }
      }
      // if (state === "capital_on_way") {
      //   try {
      //     const capital_on_way_response = await axios.post(
      //       `https://api.parafin.com/v1/sandbox/capital_product_offers/${lastCreatedOfferId}/close`,
      //       {},
      //       {
      //         headers: {
      //           Authorization: `Basic ${credentials}`,
      //           "Content-Type": "application/json"
      //         }
      //       }
      //     );
    
      //     console.log("Capital on way:", capital_on_way_response.data);
      //   } catch (error) {
      //     console.error("Error sending Capital:", error.capital_on_way_response?.data || error.message);
      //     return res.status(500).json({ error: "Failed at capital on way" });
      //   }
      // }
      // if (state === "verify_account") {
      //   try {
      //     const verify_account_response = await axios.post(
      //       `https://api.parafin.com/v1/sandbox/bank_account/bank_account_443a257a-3f53-45b3-a9a5-3afb4b9895ea/verify`,
      //       {},
      //       {
      //         headers: {
      //           Authorization: `Basic ${credentials}`,
      //           "Content-Type": "application/json"
      //         }
      //       }
      //     );
    
      //     console.log("Verify Account:", verify_account_response.data);
      //   } catch (error) {
      //     console.error("Error Verifying Account:", error.verify_account_response?.data || error.message);
      //     return res.status(500).json({ error: "Failed to verify Account" });
      //   }
      // }
      if (state === "offer_accepted") {
        try {
          const offere_accpeted_response = await axios.post(
            "https://api.parafin.com/v1/sandbox/fund_capital_product",
            {
              business_parafin_id: "business_657cd0f0-32c8-4e4a-86e0-53b3af2e8f26"
            },
            {
              headers: {
                Authorization: `Basic ${credentials}`,
                "Content-Type": "application/json"
              }
            }
          );
    
          console.log("Funded capital:", offere_accpeted_response.data);
        } catch (error) {
          console.error("Error funding capital:", error.offere_accpeted_response?.data || error.message);
          return res.status(500).json({ error: "Failed to fund capital" });
        }
      }
    else{
      res.status(400).json({ error: 'Invalid state' });
    }
});

// Starting Server
app.listen(process.env.PORT || 8080, () => {
  console.log(`App listening on PORT: ${process.env.PORT || 8080}`);
});
