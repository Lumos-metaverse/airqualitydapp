import './App.css';
import React, {useState} from "react";
import Logo from "./components/Logo";
import Header from "./components/Header";
import { ContractABI, ContractAddress } from "./utils/contractdeets";
const ethers = require("ethers");
const {ethereum} = window;
const AQI = new Map([["Bangalore", 98], ["Pune", 156], ["Kolkata", 161], ["Delhi", 377], 
["Mumbai", 129], ["Chennai", 107], ["Mangalore", 75], ["Jaipur", 288], ["Shillong", 51], ["Thiruvananthapuram", 70]]);
const pollutant = new Map ([["Bangalore", "PM10"], ["Pune", "NO2"], ["Kolkata", "PM2.5"], ["Delhi", "PM2.5"], 
["Mumbai", "PM2.5"], ["Chennai", "PM10"], ["Mangalore", "PM10"], ["Jaipur", "PM2.5"], ["Shillong", "PM2.5"], ["Thiruvananthapuram", "PM10"]]);
const quality = new Map([["Bangalore", "Satisfactory"], ["Pune", "Moderate"], ["Kolkata", "Moderate"], ["Delhi", "Very Poor"], 
["Mumbai", "Moderate"], ["Chennai", "Moderate"], ["Mangalore", "Satisfactory"], ["Jaipur", "Poor"], 
["Shillong", "Satisfactory"], ["Thiruvananthapuram", "Satisfactory"]]);
const recommendations = new Map([["Satisfactory", "All Rainbows and Sunshine, Princess. Wear a mask if you must."], 
["Moderate", "A mask must be worn when outdoors."], ["Poor", "ALERT: Masks are paramount. Stay indoors and save your lungs the trouble"], 
["Very Poor", "ALERT: Wear masks indoors. Avoid going out. Also, read a holy book of your choice and pray."],]);
const CHAIN_ID = 80001;
const NETWORK_NAME = "Mumbai";
const current = new Date();
const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;

function App() {
  const [walletAddress, setwalletAddress] = useState("");
  const [readOnly, setreadOnly] = useState(false);
  const [city, setCity] = useState('Bangalore');
  const [AQ, setAQ] = useState(0);
  const [PP, setPP] = useState("PM2.5");
  const [isStoring, setisStoring] = useState(false);

  const getChainID = async(provider) => {
    const {chainId} =  await provider.getNetwork();
    if (chainId !== CHAIN_ID) {
      setreadOnly(true);
      window.alert(`Please switch to the ${NETWORK_NAME} network`);
      throw new Error(`Please switch to the ${NETWORK_NAME} network`);
    }
  }

  const getEthereumContract = () => {
    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        getChainID(provider);
        const transactionContract = new ethers.Contract(
          ContractAddress,
          ContractABI,
          signer
        );
        return transactionContract;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const ConnectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Please install metamask");
        return;
      } else {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        setwalletAddress(accounts[0]);
        console.log("Connected", walletAddress);
      }
      } catch (error) {
      console.log(error);
    }
    };

    const handleChange = (event) => {
      setCity(event.target.value);
    };

  function handleAQInput({ target }) {
    setAQ(target.value);
  };

  function handlePPInput({ target }) {
  setPP(target.value);
  };

  async function enterCityAQI() {
    setisStoring(true);
  }

  function OwnerDisplay() {
    return (
    <div>
      <label>
      Select Your City: &nbsp;
      <select value={city} onChange={handleChange}>
      <option value="Bangalore">Bangalore</option>
      <option value="Pune">Pune</option>
      <option value="Kolkata">Kolkata</option>
      <option value="Delhi">Delhi</option>
      <option value="Chennai">Chennai</option>
      <option value="Mumbai">Mumbai</option>
      <option value="Mangalore">Mangalore</option>
      <option value="Jaipur">Jaipur</option>
      <option value="Shillong">Shillong</option>
      <option value="Thiruvananthapuram">Thiruvananthapuram</option>
      </select>
      <br />
      <label>Enter the AQI value: &nbsp;</label>
          <input onChange={handleAQInput} value={AQ} disabled = {readOnly} type="text"/>
      </label>
      <br />
      <label>Enter the PP value: &nbsp;</label>
          <input onChange={handlePPInput} value={PP} disabled = {readOnly} type="text"/>
          <br/>
      <button disabled={isStoring} onClick={enterCityAQI}>{isStoring ? "Storing..." : "Store"}</button>
    </div>
  );
}

function UserDisplay(){
  return (
    <div>
      <label>
      Select Your City: &nbsp;
      <select value={city} onChange={handleChange}>
      <option value="Bangalore">Bangalore</option>
      <option value="Pune">Pune</option>
      <option value="Kolkata">Kolkata</option>
      <option value="Delhi">Delhi</option>
      <option value="Chennai">Chennai</option>
      <option value="Mumbai">Mumbai</option>
      <option value="Mangalore">Mangalore</option>
      <option value="Jaipur">Jaipur</option>
      <option value="Shillong">Shillong</option>
      <option value="Thiruvananthapuram">Thiruvananthapuram</option>
      </select>
    </label>
    <p> <b>City: </b> {city}</p>
    <p> <b>Date: </b> {date}</p>
    <p> <b>Air Quality Index: </b> {AQI.get(city)}</p>
    <p> <b>Prominent Pollutant: </b> {pollutant.get(city)}</p>
    <p> <b>Air Quality: </b> {quality.get(city)}</p>
    <p> <b>Recommendations: </b> {recommendations.get(quality.get(city))}</p>
    </div>
  );
}

  return (
    <div className="App">
      <header className="center">
      <Logo />
      <Header title = "Air Quality dApp" />
      <div className = "right">
      {walletAddress === "" ? (<button onClick={() => ConnectWallet()} > Metamask Connect Wallet </button>) :(<p> Wallet Address Connected </p>)}
      </div>
      {walletAddress === "0x5ac392881626e06b06909b315e706b6f9df5be33" ? (<OwnerDisplay />) : (<UserDisplay />)}
      </header>
    </div>
);
}

export default App;