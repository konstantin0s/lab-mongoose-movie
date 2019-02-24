require('dotenv').config();
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const config = require('./config/database');



mongoose
  .connect(config.database, {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });
// comment one connection to use a specific database ie. (celebrities or movies)
  mongoose
  .connect(config.database, {useNewUrlParser: true})
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
let Film = require('./models/film');

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
app.set('view engine', 'hbs',);
hbs.registerPartials(path.join(__dirname, "/views/partials"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));


const index = require('./routes/index');
app.use('/', index);
const users = require('./routes/users');
app.use('/users', users);


// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';


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


     //delete celebrity
     app.delete('/celeb/:id', function(req, res) {
       let query = {_id: req.params.id}

       Celebrity.remove(query, function(err) {
         if(err) {
           console.log(err);
         }
         res.send('Success');
       })
     })
  
     //Add movie route
     app.get('/films', (req, res) => {
      Film.find({}, (err, films) => {
        if (err) {
          console.log(err);
        } else {
          res.render('films',
          {films: films});
        }
        
      });
    });

    //get Single movie
app.get('/film/:id', function(req, res) {
  Film.findOne({_id: req.params.id}, function(err, film) {
    if (err) {
      console.log(err);
    } else {
      res.render('film',
      {film: film});
    }
  });
})

//add route
app.get('/films/add', function(req, res) {
  res.render('add_film');
  });

   //add submit POST route
   app.post('/films/add', function(req, res) {

    let newFilm = new Film();
    newFilm.title = req.body.title;
    newFilm.genre = req.body.genre;
    newFilm.plot = req.body.plot;

    newFilm.save(function(err) {
         if (err) {
           console.log(err);
           return;
         } else {
           res.redirect('/films');
         }
    });
   });

    //load edit movie form
    app.get('/film/edit/:id', function(req, res) {
      Film.findOne({_id: req.params.id}, function(err, film) {
        if (err) {
          console.log(err);
        } else {
          res.render('edit_film',
          {film: film});
        }
      });
    });

    //  update movie submit
  app.get('/films/add', function(req, res) {
    res.render('add_film');
    });
  
   //add submit POST route
   app.post('/films/edit/:id', function(req, res) {
  
    let mov = {};
    mov.title = req.body.title;
    mov.genre = req.body.genre;
    mov.plot = req.body.plot;

    let query = { _id:req.params.id}
 
    Film.update(query, mov, function(err) {
         if (err) {
           console.log(err);
           return;
         } else {
           res.redirect('/films');
         }
    });
   });

     //delete movie
     app.delete('/film/:id', function(req, res) {
      let query = {_id: req.params.id}

      Film.remove(query, function(err) {
        if(err) {
          console.log(err);
        }
        res.send('Success');
      })
    })
    
    app.use(flash());

//express messages middleware
app.use(require('connect-flash')());
app.use((req, res, next) => {
   res.locals.messages = require('express-messages')(req, res);
   next();
})

//express validator middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

    //passport config
    require('./config/passport')(passport);
    //passport middleware
    app.use(passport.initialize());
    app.use(passport.session());

    app.use(function(req, res, next){
      // if there's a flash message in the session request, make it available 
        res.locals.sessionFlash = req.session.sessionFlash;
        delete req.session.sessionFlash;
        next();
      });
    
      //express session middleware
    app.use(session({
      secret: 'keyboard cat',
      resave: true,
      saveUninitialized: true
    }));
    
    

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

module.exports = app;
