export const ContractAddress = "0xda8b0Ea5fcc2beA4f40f91F03A17c96a373b2af1";

export const ContractABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_city",
				"type": "string"
			}
		],
		"name": "deletecityAQICombo",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_city",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_AQI",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_PP",
				"type": "string"
			}
		],
		"name": "setcityAQIs",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllcityAQICombos",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_city",
				"type": "string"
			}
		],
		"name": "getcityPPAQI",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "AQIval",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "PPval",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "returncityAQLLength",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];