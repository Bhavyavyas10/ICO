const Router = require("express").Router();
const contractController = require("../erc_deployer_controller");

Router.post("/deploy-contract", contractController.deployContract);

module.exports = Router;
