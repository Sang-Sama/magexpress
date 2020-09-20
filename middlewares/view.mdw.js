const exphbs = require('express-handlebars');
const hbs_sections = require('express-handlebars-sections');
const numeral = require('numeral');

module.exports = function(app) {
    app.engine('hbs', exphbs({
        layoutsDir: 'views/_layouts',
        defaultLayout: 'main',
        partialsDir: 'views/_partials',
        extname: '.hbs',
        helpers: {
            section: hbs_sections(),
            format_number: function(value) {
                return numeral(value).format('0,0');

            },
            equall: function(value, value2) {
                if (value == value2) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    }));
    app.set('view engine', 'hbs');

}