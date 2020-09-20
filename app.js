const express = require('express');
require('express-async-errors');

const app = express();

app.use(express.urlencoded({
    extended: true
}));
app.use('/public', express.static('public'));

require('./middlewares/session.mdw')(app);
require('./middlewares/view.mdw')(app);
require('./middlewares/locals.mdw')(app);

app.get('/about', function(req, res) {
    res.render('about');
})

app.get('/bs', function(req, res) {
    res.sendFile(__dirname + '/bs.html');
})
app.use('/user', require('./routes/userPost.route'));
app.use('/admin', require('./routes/admin.route'));
app.use('/admin/categories', require('./routes/category.route'));
app.use('/admin/post', require('./routes/post.route'));
app.use('/', require('./routes/home.route'));
app.use('/account', require('./routes/_account.route'));
app.use('/post', require('./routes/_post.route'));
app.use('/writer', require('./routes/Writer.route'));
app.use('/censor', require('./routes/censor.route'));

app.get('/err', function(req, res) {
    throw new Error('beng beng');
})

app.use(function(req, res) {
    res.render('404', { layout: false });
})

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).render('500', { layout: false });
})

const PORT = process.env.PORT || 3100;
app.listen(PORT, function() {
    console.log(`Server is running at http://localhost:${PORT}`);
})