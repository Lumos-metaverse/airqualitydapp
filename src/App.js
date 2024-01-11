import './App.css';
import React, {useState} from "react";
import Logo from "./components/Logo";
import Header from "./components/Header";
import { ContractABI, ContractAddress } from "./utils/contractdeets";
const ethers = require("ethers");
const {ethereum} = window; 
let cityArray = [];
const CHAIN_ID = 80001;
const NETWORK_NAME = "Mumbai";
const current = new Date();
const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;
const recommendations = new Map([["Good", "Perfect conditions. Get off your couch. Time to explore the great outdoors."],["Satisfactory", "All Rainbows and Sunshine, Princess. Wear a mask but only as a precaution."], 
["Moderate", "You're not bulletproof. Mask must be worn when outdoors. Home is where the heart is."], ["Poor", "ALERT: Masks are paramount. Minimal physical exertion. Also, stay indoors and give  your lungs and heart a break."], 
["Very Poor", "ALERT: Masks are your best friend. Yes, even indoors. Think Lockdown, claustrophobia be damned."], ["Severe", "Read a holy book. Pray. Curl up in a ball and prepare to meet your Maker."]]);

function App() {
  const [walletAddress, setwalletAddress] = useState("");
  const [readOnly, setreadOnly] = useState(false);
  const [city, setCity] = useState("None");
  const [Date, setDate] = useState(null);
  const [AQ, setAQ] = useState(0);
  const [PP, setPP] = useState("");
  const [Quality, setQuality] = useState(null);
  const [isActing, setisActing] = useState(false);

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
      if (event.target.value !== "None") {
        setCity(event.target.value);
      }

      else {
        alert("Incorrect input for City. Try again!");
      }
      
    };

    async function readCityAQI() {
      setisActing(true);
      const transactionContract = getEthereumContract();
      let allCityNames = await transactionContract.getAllcityAQICombos();
      cityArray = allCityNames.split(" ");
      for (var i=0; i<cityArray.length; i++) {
        if (cityArray[i].length === 0) {
          cityArray.splice(i,1);
        }
      }
      setisActing(false);
    }

    function findCityinArray(element) {
      let clength = cityArray.length;
      for (let i = 0; i < clength; i++) {
      if (cityArray[i] === element && cityArray.length > 0) {
       return true;
      }
     }
     return false;
    }

    async function storeCityAQI() {
      if (city === "None") {
        alert("Incorrect choice for city. Please try again");
      }
      else {
        readCityAQI();
        setisActing(true);
        setreadOnly(true);
        let val = findCityinArray(city);
        if (val === true) {
          const transactionContract = getEthereumContract();
          await transactionContract.deletecityAQICombo(city);
          await transactionContract.setcityAQIs(city, AQ, PP);
          alert("Please wait for the transaction to be confirmed on Polygon");
        }
        else if (val === false) {
          setisActing(true);
          setreadOnly(true);
          const transactionContract = getEthereumContract();
          await transactionContract.setcityAQIs(city, AQ, PP);
          alert("Please wait for the transaction to be confirmed on Polygon");

        }
      }
      setisActing(false);
      setreadOnly(false);
    }

    async function computeCityresults(cityName) {
      if (cityName === "None") {
        alert("Incorrect choice for city. Please try again");
      }
      else {
        setisActing(true);
        const transactionContract = getEthereumContract();
        let cityData = await transactionContract.getcityPPAQI(cityName);
        console.log(cityData[0]);
        setAQ(Number(cityData[0]));
        setPP(cityData[1]);
        setDate(date);
        if (Number(cityData[0]) >= 0 && Number(cityData[0]) <= 50) {
          setQuality("Good");
        } else if (Number(cityData[0]) >= 51 && Number(cityData[0]) <= 100) {
          setQuality("Satisfactory");
        } else if (Number(cityData[0]) >= 101 && Number(cityData[0]) <= 200) {
          setQuality("Moderate");
        } else if (Number(cityData[0]) >= 201 && Number(cityData[0]) <= 300) {
          setQuality("Poor");
        } else if (Number(cityData[0]) >= 301 && Number(cityData[0]) <= 400) {
          setQuality("Very Poor");
        } else if (Number(cityData[0]) >= 401 && Number(cityData[0]) <= 500) {
          setQuality("Severe");
        }
        setisActing(false);
        }
    }

  return (
    <div className="App">
      <header className="center">
      <Logo />
      <Header title = "Air Quality dApp" />
      <div className = "right">
      {walletAddress === "" ? (<button onClick={() => ConnectWallet()} > Metamask Connect Wallet </button>) :(<p> Wallet Address Connected </p>)}
      </div>
      {walletAddress === "0x5ac392881626e06b06909b315e706b6f9df5be33" ? (<div>
      <label>
      Select Your City: &nbsp;
      <select value={city} onChange={handleChange}>
      <option value="None">None</option>
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
          <input onChange={(e)=>(setAQ(e.target.value))} disabled = {readOnly} value = {AQ} type="text"/>
      </label>
      <br />
      <label>Enter PP: &nbsp;</label>
          <input onChange={(e)=>(setPP(e.target.value))} disabled = {readOnly} value = {PP} type="text"/>
          <br/>
          <button disabled={isActing} onClick={() => readCityAQI()}>{isActing ? "Reading..." : "Read"}</button>
          <button disabled={isActing} onClick={() => storeCityAQI()}>{isActing ? "Storing..." : "Store"}</button>
      <br />
      <h3>Cities</h3>
        {cityArray.map((cities) => (
            <label key={cities} >
                {cities.concat(" ")}
            </label>
        ))
    }
    </div>
    ) : (<div>
      <label>
      Select Your City: &nbsp;
      <select value={city} onChange={handleChange}>
      <option value="None">None</option>
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
    <p> <b>Date: </b> {Date}</p>
    <p> <b>Air Quality Index: </b>{AQ}</p>
    <p> <b>Prominent Pollutant: </b> {PP}</p>
    <p> <b>Air Quality: </b>{Quality}</p>
    <p> <b>Recommendations: </b> {recommendations.get(Quality)}</p>
    <button disabled={isActing} onClick={() => computeCityresults(city)}>{isActing ? "Computing..." : "Compute"}</button>
    </div>)}
      </header>
    </div>
);
}

export default App;