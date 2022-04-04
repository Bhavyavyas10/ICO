const shell = require("shelljs");
const fs = require("fs");
const Web3 = require("web3");
const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
const { exec } = require("child_process");


exports.deployContract = async (req, res) => {
  try {
    res.send("Contract Deployment Under Process");
    exec("npx truffle migrate --network rinkeby --reset",(error,stdout,stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
    })
    //shell.exec("./deploy.sh");
  } catch (err) {
    console.log(err);
  }
};
