require('dotenv').config();

const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');


mongoose
  .connect('mongodb://localhost/celebrities', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

let Celebrity = require('./models/celebrity');

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));

      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));



// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';



const index = require('./routes/index');
app.use('/', index);


app.get('/celebrities', (req, res) => {
  Celebrity.find({}, (err, celebrities) => {
    if (err) {
      console.log(err);
    } else {
      res.render('celebrities',
      {celebrities: celebrities});
    }
    
  });
});

//get Single celebrity
app.get('/celeb/:id', function(req, res) {
  Celebrity.findOne({_id: req.params.id}, function(err, celeb) {
    if (err) {
      console.log(err);
    } else {
      res.render('celeb',
      {celeb: celeb});
    }
  });
})

//add route
app.get('/celebrities/add', function(req, res) {
  res.render('add_celebrity');
  });

   //add submit POST route
   app.post('/celebrities/add', function(req, res) {

    let celebr = new Celebrity();
    celebr.name = req.body.name;
    celebr.occupation = req.body.occupation;
    celebr.catchPhrase = req.body.catchPhrase;
 
    celebr.save(function(err) {
         if (err) {
           console.log(err);
           return;
         } else {
           res.redirect('/celebrities');
         }
    });
   });

   //load edit form
   app.get('/celeb/edit/:id', function(req, res) {
    Celebrity.findOne({_id: req.params.id}, function(err, celeb) {
      if (err) {
        console.log(err);
      } else {
        res.render('edit_celeb',
        {celeb: celeb});
      }
    });
  });


  //update submit
  app.get('/celebrities/add', function(req, res) {
    res.render('add_celebrity');
    });
  
     //add submit POST route
     app.post('/celebrities/edit/:id', function(req, res) {
  
      let celebr = {};
      celebr.name = req.body.name;
      celebr.occupation = req.body.occupation;
      celebr.catchPhrase = req.body.catchPhrase;

      let query = { _id:req.params.id}
   
      Celebrity.update(query, celebr, function(err) {
           if (err) {
             console.log(err);
             return;
           } else {
             res.redirect('/celebrities');
           }
      });
     });
  

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

module.exports = app;
