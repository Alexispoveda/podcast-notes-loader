const controller = require('../controllers/app.controller');

module.exports = (app) => {
    app.get("/", controller.login);

    app.get("/callback", controller.load);
}