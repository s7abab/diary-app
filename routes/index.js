var express = require('express');
const startingContent = require('../models/data');
var router = express.Router();

const allPosts = [];

const isAuthenticated = (req, res, next) => {
  if (req.session.loggedIn) {
    res.setHeader('Cache-Control', 'no-store');
    next();
  } else {
    res.redirect('/login');
  }
};
router.get('/', (req, res, next)=> {
  if (req.session.loggedIn) {
    res.render('index', { content: startingContent, posts: allPosts });
  } else {
    res.render('login');
  }
});


//compose
router.get('/compose', (req, res, next)=> {
  if (req.session.loggedIn) {
    res.render('compose')
  } else {
    res.render('login');
  }
});

router.post('/compose', (req,res)=>{
  let post = {
    title: req.body.title,
    body: req.body.body
  }
  allPosts.push(post);

  res.redirect('/');
});

router.get('/posts/:item',(req,res)=>{
  let searchTitle = req.params.item;
  allPosts.forEach(element => {
    let foundTitle = element.title
    if(foundTitle === searchTitle){
      res.render('post', {title : element.title, body: element.body})
    }
  });
})

//login
router.get('/login', (req,res)=>{
  res.render('login')
})
//login post
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  // Perform validation here with predefined username and password
  if (email === 'admin@gmail.com' && password === '123') {
    req.session.loggedIn = true;
    res.redirect('/');
  } else {
    res.send('Incorrect username or password');
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});



module.exports = router;

