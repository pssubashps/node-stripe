const config = require('config');
console.log(config);

const keyPublishable = config.stripe.publicKey; // or const keyPublishable = process.env.PUBLISHABLE_KEY;
const keySecret = config.stripe.secretKey; // or const keySecret = process.env.SECRET_KEY;
const port = normalizePort(process.env.PORT || '3002');


const app = require("express")();
const stripe = require("stripe")(keySecret);
app.set('port', port);
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var my_amount = {amount: 12.34, currency: "USD"};

app.get("/", (req, res) =>
  res.render("index.pug", {keyPublishable, my_amount}));

app.post("/charge", (req, res) => {
  let amount = my_amount.amount * 100;

  stripe.customers.create({
     email: req.body.stripeEmail,
    source: req.body.stripeToken
  })
  .then(customer =>
    stripe.charges.create({
      amount,
      description: "Sample Charge",
         currency: my_amount.currency,
         customer: customer.id
    }))
  .then(charge => res.render("charge.pug", {my_amount}));
});

app.listen(port);

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}