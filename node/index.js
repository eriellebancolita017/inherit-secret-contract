import { SecretNetworkClient, Wallet } from "secretjs";
import * as fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const wallet = new Wallet(process.env.MNEMONIC);

const contract_wasm = fs.readFileSync("../contract.wasm.gz");

const secretjs = new SecretNetworkClient({
    chainId: "pulsar-3",
    url: "https://api.pulsar.scrttestnet.com",
    wallet: wallet,
    walletAddress: wallet.address,
});

// console.log(secretjs);

let upload_contract = async () => {
    let tx = await secretjs.tx.compute.storeCode(
      {
        sender: wallet.address,
        wasm_byte_code: contract_wasm,
        source: "",
        builder: "",
      },
      {
        gasLimit: 4_000_000,
      }
    );
  
    const codeId = Number(
      tx.arrayLog.find((log) => log.type === "message" && log.key === "code_id")
        .value
    );
  
    console.log("codeId: ", codeId);
  
    const contractCodeHash = (
      await secretjs.query.compute.codeHashByCodeId({ code_id: codeId })
    ).code_hash;
    console.log(`Contract hash: ${contractCodeHash}`);
    
};
  
// upload_contract();

let instantiate_contract = async () => {
    // Create an instance of the Counter contract, providing a starting count
    const initMsg = { password: "test", whitelist: ["secret1yufr2hav2eyaqny9qjulwlqmzg08m9aduc4ly9"], elapsed_blocks: 10000 };
    let tx = await secretjs.tx.compute.instantiateContract(
      {
        // code_id: codeId,
        code_id: 4356,
        sender: wallet.address,
        // code_hash: contractCodeHash,
        code_hash: "0f2dce4850331b3596970b9cac8264a2a08ea4982cc67addf17946bff6feacd7",
        init_msg: initMsg,
        label: "My first inherit secret contract",
      },
      {
        gasLimit: 400_000,
      }
    );
  
    //Find the contract_address in the logs
    const contractAddress = tx.arrayLog.find(
      (log) => log.type === "message" && log.key === "contract_address"
    ).value;
  
    console.log(contractAddress);
};
  
// instantiate_contract();

let try_query = async () => {
    const my_query = await secretjs.query.compute.queryContract({
    //   contract_address: contract_address,
    //   code_hash: contractCodeHash,
      contract_address: "secret1lekjax247leuysfplejwk2zx8xmdc9kl3fjsur",
      code_hash: "0f2dce4850331b3596970b9cac8264a2a08ea4982cc67addf17946bff6feacd7",
      query: { get_elapsed_block_time: {} },
    }).catch(err => console.log(err));
  
    console.log(my_query);
};
  
try_query();

let try_execute = async () => {
    let tx = await secretjs.tx.compute.executeContract(
      {
        sender: wallet.address,
        contract_address: "secret1lekjax247leuysfplejwk2zx8xmdc9kl3fjsur",
        code_hash: "0f2dce4850331b3596970b9cac8264a2a08ea4982cc67addf17946bff6feacd7", // optional but way faster
        msg: {
          increment: {},
        },
        sentFunds: [], // optional
      },
      {
        gasLimit: 100_000,
      }
    );
    console.log("incrementing...");
};
  
// try_execute();