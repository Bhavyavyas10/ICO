import React, { Component,useState,useEffect } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import ERC from "./contracts/TestToken.json";
import ICO from "./contracts/ICO.json";
import getWeb3 from "./getWeb3";
import lottie from "lottie-web";
import FrontLottie from "./front.json"
import { Button, Modal } from "react-bootstrap";
import { Form } from "react-bootstrap";
import Launch from "./TokenLaunch";
import { useNavigate } from "react-router-dom";

import "./App.css";

const Landing = () => {

  const [web3,setWeb3] = useState();
  const [accounts,setAccounts] = useState();
  const [contract,setContract] = useState();
  const [tokenCreationModal,setTokenCreationModal] = useState(false);
  const [tokenName,setTokenName] = useState("");
  const [tokenSymbol,setTokenSymbol] = useState("");
  const [tokenSupply,setTokenSupply] = useState(0);
  const [tokenOwner,setTokenOwner] = useState("");

  const initializer = async () => {
    try{
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      connectWallet();
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

  const animator = () => {
    lottie.loadAnimation({
      container: document.querySelector("#FrontLottie"),
      animationData: FrontLottie,
      renderer: "svg", // "canvas", "html"
      loop: true, // boolean
      autoplay: true, // boolean
    });
  }

  useEffect(() => {
    initializer();
  },[accounts]) 

  useEffect(() => {
    animator();
  },[])

  const deployer = async() => {
    const dep = await new web3.eth.Contract(ERC.abi)
                .deploy({
                  data:ERC.bytecode,
                  arguments: [tokenName,tokenSymbol,tokenSupply,tokenOwner]
                }).send({from:accounts[0],gas:3000000});
    console.log(dep);
    alert(dep._address);
  }

  const handleTokenCreationClose = () => {
    setTokenCreationModal(false);
  }

  const handleTokenCreationOpen = () => {
    setTokenCreationModal(true);
  }

  const createToken = () => {
    deployer();
    handleTokenCreationClose();
  }

 const navigate = useNavigate();


  return(
    <div>
      <div className="App_Header"  >
        <div>
          <h3 className="White" >ICO Launchpad</h3>
        </div>
        <div>
          {accounts && <h4 className="White">{accounts}</h4>}
        </div>
      </div>
      <div style={{backgroundColor:"#1b1a30",display:"flex",justifyContent:"center"}} >
        <h2 className="White">World Class Crypto Token Launchpad</h2>
      </div>
      <div style={{backgroundColor:"#1b1a30",display:"flex",justifyContent:"space-evenly"}}>
        <h4 className="White" style={{cursor:"pointer"}}  >White Paper</h4>
        <h4 className="White" style={{cursor:"pointer"}} onClick={() => {navigate("/launch")}} >Apply For Launch</h4>
        <h4 className="White" style={{cursor:"pointer"}} onClick={() => {navigate("/startcampaign")}} >Start Crowd Funding</h4>
        <h4 className="White" style={{cursor:"pointer"}} onClick={() => {navigate("/marketplace")}} >Participate In Campaign</h4>
      </div>
        <div id="FrontLottie" >
        </div>

      {/* <Modal show={tokenCreationModal} onHide={handleTokenCreationClose} >
        <Modal.Header closeButton>
            <Modal.Title>Create Your ERC20 Token</Modal.Title>
          </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" >
            <Form.Label>Token Name</Form.Label>
            <input  onChange={(e) => {setTokenName(e.target.value)}} />
          </Form.Group>
          <Form.Group className="mb-3" >
            <Form.Label>Token Symbol</Form.Label>
            <input onChange={(e) => {setTokenSymbol(e.target.value)}} />
            </Form.Group>
            <Form.Group className="mb-3" >
            <Form.Label>Token Supply</Form.Label>
            <input onChange={(e) => {setTokenSupply(e.target.value)}} />
            </Form.Group>
            <Form.Group className="mb-3" >
            <Form.Label>Token Owner Address</Form.Label>
            <input onChange={(e) => {setTokenOwner(e.target.value)}} />
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-primary" onClick={createToken} >Submit</Button>
        </Modal.Footer>
      </Modal> */}
    </div>
  )

}

// class App extends Component {
//   state = { storageValue: 0, web3: null, accounts: null, contract: null };

//   componentDidMount = async () => {
//     try {
//       // Get network provider and web3 instance.
//       const web3 = await getWeb3();

//       // Use web3 to get the user's accounts.
//       const accounts = await web3.eth.getAccounts();
//       console.log(accounts)

//       // Get the contract instance.
//       const networkId = await web3.eth.net.getId();
//       const deployedNetwork = SimpleStorageContract.networks[networkId];
//       const instance = new web3.eth.Contract(
//         SimpleStorageContract.abi,
//         deployedNetwork && deployedNetwork.address,
//       );

//       // Set web3, accounts, and contract to the state, and then proceed with an
//       // example of interacting with the contract's methods.
//       this.setState({ web3, accounts, contract: instance });
//     } catch (error) {
//       // Catch any errors for any of the above operations.
//       alert(
//         `Failed to load web3, accounts, or contract. Check console for details.`,
//       );
//       console.error(error);
//     }
//   };

//   runExample = async () => {
//     const { accounts, contract } = this.state;

//     // Stores a given value, 5 by default.
//     await contract.methods.set(5).send({ from: accounts[0] });

//     // Get the value from the contract to prove it worked.
//     const response = await contract.methods.get().call();

//     // Update state with the result.
//     this.setState({ storageValue: response });
//   };

//   render() {
//     if (!this.state.web3) {
//       return <div>Loading Web3, accounts, and contract...</div>;
//     }
//     return (
//       <div className="App">
//         <h1>Good to Go!</h1>
//         <p>Your Truffle Box is installed and ready.</p>
//         <h2>Smart Contract Example</h2>
//         <p>
//           If your contracts compiled and migrated successfully, below will show
//           a stored value of 5 (by default).
//         </p>
//         <p>
//           Try changing the value stored on <strong>line 42</strong> of App.js.
//         </p>
//         <div>The stored value is: {this.state.storageValue}</div>
//       </div>
//     );
//   }
// }

export default Landing;
