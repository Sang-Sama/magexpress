const LRU = require('lru-cache');
const categoryModel = require('../models/category.model');

const GLOBAL_CATEGORIES = 'globalCategories';
const GLOBAL_FIELD = 'globalField';
const cache = new LRU({
    max: 500,
    maxAge: 1000 * 60
})

module.exports = function(app) {
    app.use(function(req, res, next) {
        if (req.session.isAuthenticated === null) {
            req.session.isAuthenticated = false;
        }

        res.locals.lcIsAuthenticated = req.session.isAuthenticated;
        res.locals.lcAuthUser = req.session.authUser;
        next();
    })
    app.use(async function(req, res, next) {
        const datafield = cache.get(GLOBAL_FIELD);
        if (!datafield) {
            //console.log('-- fetch `GLOBAL_FIELD');
            const rows = await categoryModel.allfield();
            res.locals.lcField = rows;
            cache.set(GLOBAL_FIELD, rows);
        } else {
            //console.log('++ cache hit for `GLOBAL_FIELD');
            for (const c of datafield) {
                delete c.isActive;
            }
            res.locals.lcField = datafield;
        }

        next();
    })

    app.use(async function(req, res, next) {
        const data = cache.get(GLOBAL_CATEGORIES);
        if (!data) {
            // console.log('-- fetch `globalCategories');
            const rows = await categoryModel.allnew();
            res.locals.lcCategories = rows;
            cache.set(GLOBAL_CATEGORIES, rows);
        } else {
            // console.log('++ cache hit for `globalCategories');
            for (const c of data) {
                delete c.isActive;
            }
            res.locals.lcCategories = data;
        }

        next();
    })


}