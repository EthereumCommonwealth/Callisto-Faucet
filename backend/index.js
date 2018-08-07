import fs from "fs";
import express from "express";
import bodyParser from "body-parser";
import Web3 from "web3";
import Tx from "ethereumjs-tx";
import cors from 'cors';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Environment vars
const fromAddress = process.env.FROM_ADDRESS;
const privateKey = new Buffer(process.env.PRIVATE_KEY, "hex");
const contractAddress = process.env.CONTRACT_ADDRESS;
const rpcServer = process.env.RPC_SERVER;

const faucetABI = JSON.parse(fs.readFileSync("faucet-abi.json", "utf8"));

async function sendTransaction(address) {
  const web3 = new Web3("https://clo-testnet3.0xinfra.com/");
  //const web3 = new Web3(rpcServer);

  const Faucet = new web3.eth.Contract(faucetABI, contractAddress);

  if (!web3.utils.isAddress(address)) {
    return [false, "Your address is not valid"];
  }
  let remainingBlocks = await Faucet.methods.checkRemainingBlocks(address).call({from: fromAddress});
  remainingBlocks = parseInt(remainingBlocks);

  if (remainingBlocks > 0) {
    return [false, `Your address has been funded. Please wait for ${remainingBlocks} blocks.`];
  }

  let sendCLO = Faucet.methods.sendEther(address)

  // Construct the raw transaction
  const gasPriceHex = web3.utils.toHex(2000000000000);
  const gasLimitHex = web3.utils.toHex(500000);

  const nonce = await web3.eth.getTransactionCount(fromAddress, "pending");
  const nonceHex = web3.utils.toHex(nonce);

  const rawTx = {
    nonce: nonceHex,
    gasPrice: gasPriceHex,
    gasLimit: gasLimitHex,
    data: sendCLO.encodeABI(),
    from: fromAddress,
    to: contractAddress,
    chainId: 7919
  };

  const tx = new Tx(rawTx);
  tx.sign(privateKey);
  const serializedTx = tx.serialize();

  let transaction = null;

  try{
    transaction = await web3.eth.sendSignedTransaction("0x" + serializedTx.toString("hex"));
    return [transaction.transactionHash, false];
  } catch (error) {
    console.log(error)
    if (Object.keys(error).length === 0) {
      console.log(transaction);
      return [false, "Waiting for transaction."];
    }
    return [false, error];
  }
}

app.post("/faucet", async (req, res) => {
  const faucetResult = await sendTransaction(req.body.address.trim());
  const resBody = {
    transactionHash: faucetResult[0] ? faucetResult[0] : null,
    error: faucetResult[1] ? faucetResult[1] : null
  }
  const resCode = faucetResult[0] ? 200 : 409
  res.status(resCode).send(resBody);
})

app.get("/", async (req, res) => {
  res.status(200).send({
    "me": "I'm the Callisto Faucet System."
  })
})

app.listen(8080, () => console.log("I'm the Callisto Faucet System on port 8080!"));
