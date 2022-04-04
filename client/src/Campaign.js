import React, { Component,useState,useEffect } from "react";
import ERC from "./contracts/TestToken.json";
import ICO from "./contracts/ICO.json";
import getWeb3 from "./getWeb3";
import { useNavigate } from "react-router-dom";
import {BallTriangle} from "react-loader-spinner";

import "./App.css";

const Campaign = () => {

  const [web3,setWeb3] = useState();
  const [accounts,setAccounts] = useState();
  const [contract,setContract] = useState();
  const [ercInstance,setERCInstance] = useState();
  const [tokenCreationModal,setTokenCreationModal] = useState(false);
  const [tokenName,setTokenName] = useState("");
  const [tokenSymbol,setTokenSymbol] = useState("");
  const [tokenSupply,setTokenSupply] = useState(0);
  const [tokenOwner,setTokenOwner] = useState("");
  const [visible,IsVisible] = useState(false);
  const [tokenAddress,setTokenAddress] = useState();
  const [endTime,setEndTime] = useState();
  const [tokenPerETHInCampaign,setTokenPerETH] = useState();
  const [maxLiquidity,setMaxLiquidity] = useState();

  const navigate = useNavigate();

  const initializer = async () => {
    try{
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      //connectWallet();
      console.log(accounts)
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = ICO.networks[networkId];
      const instance = new web3.eth.Contract(
        ICO.abi,
        deployedNetwork && deployedNetwork.address,
      );
      const ERCInstance = new web3.eth.Contract(
        ERC.abi,
        tokenAddress && tokenAddress
      )
      console.log(instance)
      setWeb3(web3);
      setAccounts(accounts);
      setContract(instance)
      setERCInstance(ERCInstance)
    }catch (e) {
      console.log(e)
    }
  }

  const connectWallet = async () => {
    window.ethereum.on("accountsChanged", function (accounts) {
      console.log("kjcnkjdsnc",accounts)
      const updated = accounts[0];
      setAccounts(updated);
      console.log("updated", accounts[0]);
    });
  };
  
  useEffect(() => {
    initializer();
    connectWallet();
  },[])

  const startCampaign = async() => {
    console.log(contract._address,accounts)
    IsVisible(true);
    const ml = web3.utils.toWei(maxLiquidity.toString(),'ether');
    const bn = web3.utils.toBN(ml);
    const ERCInstance = new web3.eth.Contract(
      ERC.abi,
      tokenAddress && tokenAddress
    )
    console.log(ercInstance)
    const approveAmount = await ERCInstance.methods.approve(contract._address,bn).send({from:accounts[0]});
    console.log(approveAmount)
    const tx = await contract.methods.startCampaign(tokenAddress,endTime,tokenPerETHInCampaign,maxLiquidity).send({from:accounts[0]})
    console.log(tx);
    IsVisible(false);
  }

  return(
    <div>
      <div className="App_Header"  >
        <div>
          <h3 className="White" onClick={() => {navigate("/");}} style={{cursor:"pointer"}} >ICO Launchpad</h3>
        </div>
        <div>
          {accounts && <h4 className="White">{accounts}</h4>}
        </div>
      </div>
      <div style={{backgroundColor:"#1b1a30",display:"flex",justifyContent:"center"}} >
        <h1 className="White">Launch Your ERC20 Token</h1>
        {/* <h2 className="White">World Class Crypto Token Launchpad</h2> */}
      </div>
      <div style={{display:"flex",margin:"110px",justifyContent:"center",alignItems:"center",flexDirection:"column"}}>
        <h2>Token Address</h2>
        <input  onChange={(e) => {setTokenAddress(e.target.value)}} style={{width:"500px",height:"30px"}} />
        <h2>Ending Time</h2>
        <input onChange={(e) => {setEndTime(e.target.value)}} style={{width:"500px",height:"30px"}} />
        <h2>Token Per ETH</h2>
        <input onChange={(e) => {setTokenPerETH(e.target.value)}} style={{width:"500px",height:"30px"}} />
        <h2>Maximum Liquidity For Launching</h2>
        <input onChange={(e) => {setMaxLiquidity(e.target.value)}} style={{width:"500px",height:"30px"}} />
        <button onClick={() => {startCampaign();IsVisible(true)}} style={{width:"310px",margin:"25px",height:"40px",backgroundColor:"#1b1130",color:"white",cursor:"pointer"}} ><b>Submit</b></button>
        <button onClick={() => {navigate("/");}} style={{width:"220px",margin:"5px",height:"40px",cursor:"pointer"}} ><b>Back</b></button>
        {/* <button onClick={() => {}} >Start Crowd Funding</button> */}
      </div>
      {visible === true && (
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "300px",
        }} >
          <BallTriangle
          color="#3187ed"
          height={100}
          width={100}
          visible={true}
      />
        </div>
      )}
    </div>
  )

}

export default Campaign