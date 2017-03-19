
const express = require('express');
const router = express.Router();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const {ShoppingList} = require('./models');
var {Recipes} = require('/.models');

const jsonParser = bodyParser.json();
const app = express();

// log the http layer
app.use(morgan('common'));

// we're going to add some items to ShoppingList
// so there's some data to look at
ShoppingList.create('beans', 2);
ShoppingList.create('tomatoes', 3);
ShoppingList.create('peppers', 4);

Recipes.create('Chocolate Milk', ['ingr1', 'ingr2', 'ingr3'])


// when the root of this router is called with GET, return
// all current ShoppingList items
app.get('/shopping-list', (req, res) => {
  res.json(ShoppingList.get());
});

app.post('/shopping-list', jsonParser, (req, res) => {
  // ensure `name` and `budget` are in request body
  const requiredFields = ['name', 'budget'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  const item = ShoppingList.create(req.body.name, req.body.budget);
  res.status(201).json(item);
});


app.get('/recipes', function(request,response){
	response.json(Recipes.get());
});

app.post('/recipes', jsonParser, function(request,response){
  var requiredFields = ['name', 'ingredients'];
  for (let i=0; i<requiredFields.length; i++) {
    var field = requiredFields[i];
    if (!(field in request.body)) {
      var message = `Missing \`${field}\` in request body`
      console.error(message);
      return response.status(400).send(message);
    }
  }

  var item = Recipes.create(request.body.name, request.body.ingredients);
  response.status(201).json(item);
});


app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});
