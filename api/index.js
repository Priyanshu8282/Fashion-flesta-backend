const app = require("../app");
const { connectDB } = require("../config");

connectDB();

module.exports = app;
