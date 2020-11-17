const express = require("express");

const app = express();
require("dotenv").config();

const { PORT, TEST_STR } = process.env;
const stripe = require("stripe")(TEST_STR);

app.use(express.json());

app.listen(PORT, () => console.log("listening on ", PORT));

app.get("/home", async (req, res) => {
  res.status(200).sendFile("./home.html");
});

app.post("/create-checkout-session", async (req, res) => {
  const { priceId } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
      // the actual Session ID is returned in the query parameter when your customer
      // is redirected to the success page.
      success_url: `https://example.com/success.html?session_id=${CHECKOUT_SESSION_ID}`,
      cancel_url: "https://example.com/canceled.html"
    });

    res.send({
      sessionId: session.id
    });
  } catch (e) {
    res.status(400);
    return res.send({
      error: {
        message: e.message
      }
    });
  }
});
