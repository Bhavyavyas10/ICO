import React, { Component,useState,useEffect } from "react";
import ERC from "./contracts/TestToken.json";
import ICO from "./contracts/ICO.json";
import getWeb3 from "./getWeb3";
import { useNavigate } from "react-router-dom";
import {BallTriangle} from "react-loader-spinner";

import "./App.css";

const Listing = () => {

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
  const [totalData,setTotalData] = useState();
  const [tokenData,setTokenData] = useState([]);

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

      const dataCounter = await instance.methods.campaignId().call();
      console.log(dataCounter)
      const tk = [];
      for(var i=1;i<=dataCounter-1;i++){
        const data = await instance.methods.campaigns(i).call();
        console.log("TOKENS",data)
        tk.push(data)
      }
      setTokenData(tk);

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

  // useEffect(() => {
  //   list();
  // },[])

  // const list = async() => {
  //   console.log("sjnckjndskjvnckj",contract)
  //   const counter = await contract.methods.campaignId().call();
  //   console.log(counter)
  //   setTotalData(counter);

  //   for(var i=1;i<=counter;i++){
  //     const data = await contract.methods.campaigns(i).call();
  //     console.log(data);
  //   }

  // }

  const ts = (time) => {
    console.log(time)
    const dt = new Date(time * 1000).toISOString().slice(0, 19).replace('T', ' ');
    // const hrs = dt.getHours();
    // const min = "0" + dt.getMinutes();
    // const sec = "0" + dt.getSeconds();
    // const format = hrs + ":" + min.substr(-2) + ":" + sec.substr(-2);
    console.log(dt)
    return dt;
  }

  const buy = async(key_) => {
    const deposit = await contract.methods.depositETH().send({from:accounts[0],value:1000000000000000000});
    const buyToken = await contract.methods.normalPurchase(key_,1).send({from:accounts[0]})
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
        <h2 className="White">Ongoing Campaigns</h2>
      </div>
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin:"50px"
      }}>
        <table>
          <tr>
            <th style={{padding:"10px"}} >Token Origin Address</th>
            <th style={{padding:"10px"}}>Market Value</th>
            <th style={{padding:"10px"}}>Campaign Starting Time</th>
            <th style={{padding:"10px"}}>Campaign Ending Time</th>
            <th style={{padding:"10px"}}>Tokens Remaining In Sale</th>
          </tr>
          {tokenData && tokenData.map((e,key) => {
            return(
              <tr>
                {console.log("KEY:",key)}
                <td style={{padding:"10px"}} >{tokenData[0].initiator}</td>
                <td style={{padding:"10px"}}>{tokenData[0].tokenPerETHInCampaign}ETH</td>
                {/* <td style={{padding:"10px"}}>{ts(tokenData[0].campaignEndTime)}</td> */}
                <td style={{padding:"10px"}}>{ts(tokenData[0].campaignStartTime)}</td>
                <td style={{padding:"10px"}}>{ts(tokenData[0].campaignEndTime)}</td>
                <td style={{padding:"10px"}}>{tokenData[0].maxTokenLiquidity - tokenData[0].tokenLiquidityAchived}</td>
                <td style={{padding:"10px",cursor:"pointer"}} onClick={() => {buy(key+1)}} ><button>Buy Token Share</button></td>
              </tr>
              // <div>
              //   {console.log("qwerty",tokenData[0].initiator)}
              // </div>
            )
          })}
        </table>
      </div>
    </div>
  )

}

export default Listing;