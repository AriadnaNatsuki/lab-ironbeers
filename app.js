const express = require('express');

const hbs = require('hbs');
const path = require('path');
const PunkAPIWrapper = require('punkapi-javascript-wrapper');

const app = express();
const punkAPI = new PunkAPIWrapper();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

hbs.registerPartials(__dirname + '/views/partials');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/beers', (req, res) => {
  punkAPI
    .getBeers()
    .then(beersFromApi => {
      let moreBeers = true;
      const data = {
        beers: beersFromApi.map(beer => {
          return {
            ...beer,
            moreBeers
          };
        })
      };
      res.render('beers', data);
      console.log('Beers from the database: ', beersFromApi);
    })
    .catch(error => console.log(error));
});

app.get('/random-beer', (req, res) => {
  punkAPI
    .getRandom()
    .then(beersFromApi => {
      res.render('random-beer', { beers: beersFromApi });
      console.log('Random Beer from the database: ', beersFromApi);
    })
    .catch(error => console.log(error));
});
app.get('/beer/:id', (req, res, id) => {
  var id = req.params.id;
  punkAPI
    .getBeer(id)
    .then(beerId => {
      let moreInfo = true;
      const data = {
        beers: beerId.map(beer => {
          return {
            ...beer,
            moreInfo
          };
        })
      };
      res.render('beer/id', data);
      console.log('ID Beer from the database: ', beerId);
    })
    .catch(error => console.log(error));
});
app.listen(3000, () => console.log('🏃‍ on port 3000'));
