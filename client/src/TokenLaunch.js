import React, { Component,useState,useEffect } from "react";
import ERC from "./contracts/TestToken.json";
import ICO from "./contracts/ICO.json";
import getWeb3 from "./getWeb3";
import { useNavigate } from "react-router-dom";
import {BallTriangle} from "react-loader-spinner";

import "./App.css";



const Launch = () => {

  const [web3,setWeb3] = useState();
  const [accounts,setAccounts] = useState();
  const [contract,setContract] = useState();
  const [tokenCreationModal,setTokenCreationModal] = useState(false);
  const [tokenName,setTokenName] = useState("");
  const [tokenSymbol,setTokenSymbol] = useState("");
  const [tokenSupply,setTokenSupply] = useState(0);
  const [tokenOwner,setTokenOwner] = useState("");
  const [visible,IsVisible] = useState(false);

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
      console.log(instance)
      setWeb3(web3);
      setAccounts(accounts);
      setContract(instance)
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


  const deployer = async() => {
    IsVisible(true)
    const dep = await new web3.eth.Contract(ERC.abi)
                .deploy({
                  data:ERC.bytecode,
                  arguments: [tokenName,tokenSymbol,tokenSupply,tokenOwner]
                }).send({from:accounts[0],gas:3000000});
    console.log(dep);
    alert(dep._address);
    IsVisible(false)

  }

  const createToken = () => {
    deployer();
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
        {/* <h2 className="White">World Class Crypto Token Launchpad</h2> */}
        <h1 className="White">Create Your ERC20 Token</h1>
      </div>
      <div style={{display:"flex",margin:"100px",justifyContent:"center",alignItems:"center",flexDirection:"column"}}>
        <h2>Token Name</h2>
        <input  onChange={(e) => {setTokenName(e.target.value)}} style={{width:"500px",height:"30px"}} />
        <h2>Token Symbol</h2>
        <input onChange={(e) => {setTokenSymbol(e.target.value)}} style={{width:"500px",height:"30px"}} />
        <h2>Token Supply</h2>
        <input onChange={(e) => {setTokenSupply(e.target.value)}} style={{width:"500px",height:"30px"}} />
        <h2>Token Owner Address</h2>
        <input onChange={(e) => {setTokenOwner(e.target.value)}} style={{width:"500px",height:"30px"}} />
        <button onClick={() => {createToken();IsVisible(true)}} style={{width:"310px",margin:"25px",height:"40px",backgroundColor:"#1b1130",color:"white",cursor:"pointer"}} ><b>Submit</b></button>
        <div style={{display:"flex",justifyContent:"center",alignItems:"center"}} >
          <div style={{display:"flex",justifyContent:"flex-start",alignItems:"center",margin:"0px 50px"}} >
            <button onClick={() => {navigate("/");}} style={{margin:"-40px",height:"40px",cursor:"pointer",width:"100px"}} >Back</button>
          </div>
          <div>
            <button onClick={() => {navigate("/startcampaign")}} style={{height:"40px",cursor:"pointer"}} >Start Crowd Funding</button>
          </div>
        </div>
       
      </div>
      {/* <div style={{backgroundImage:`url("https://lottiefiles.com/share/3oidspap)`}} >
        <h1>Hello</h1>
      </div> */}
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

export default Launch