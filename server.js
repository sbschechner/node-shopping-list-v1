
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

// when PUT request comes in with updated item, ensure has
// required fields. also ensure that item id in url path, and
// item id in updated item object match. if problems with any
// of that, log error and send back status code 400. otherwise
// call `ShoppingList.update` with updated item.
app.put('/shopping-list/:id', jsonParser, (req, res) => {
  const requiredFields = ['name', 'budget', 'id'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = (
      `Request path id (${req.params.id}) and request body id `
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating shopping list item \`${req.params.id}\``);
  const updatedItem = ShoppingList.update({
    id: req.params.id,
    name: req.body.name,
    budget: req.body.budget
  });
  res.status(204).json(updatedItem);
});

app.delete('/shopping-list/:id', (req, res) => {
  ShoppingList.delete(req.params.id);
  console.log(`Deleted shopping list item \`${req.params.id}\``);
  res.status(204).end();
});



app.get('/recipes', function(request,response){
	response.json(Recipes.get());
});

app.post('/recipes', jsonParser, function(request,response){
  var requiredFields = ['name', 'ingredients'];
  for (let i=0; i<requiredFields.length; i++) { //validating the response from the API
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


app.put('/recipes/:id', jsonParser, function(request, response){
  var requiredFields = ['name', 'ingredients', 'id'];
  for (let i=0; i<requiredFields.length; i++) {
    var field = requiredFields[i];
    if (!(field in request.body)) {
      var message = `Missing \`${field}\` in request body`
      console.error(message);
      return response.status(400).send(message);
    }
  }
  if (request.params.id !== request.body.id) {
    var message = (
      `Request path id (${req.params.id}) and request body id `
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating shopping list item \`${req.params.id}\``);
  const updatedItem = ShoppingList.update({
    id: request.params.id,
    name: request.body.name,
    ingredients: request.body.ingredients
  });
  response.status(204).json(updatedItem);
});

app.delete('/recipes/:id', function(request, response){
  Recipes.delete(request.params.id);
  console.log(`Deleted shopping list item \`${request.params.id}\``);
  response.status(204).end();
});


app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});
