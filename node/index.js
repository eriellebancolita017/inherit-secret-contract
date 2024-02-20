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
  
upload_contract();

let instantiate_contract = async () => {
    // Create an instance of the Inherit contract, providing a initial Message
    const initMsg = { password: "test", whitelist: ["secret1dcufar7e2mj22jaemfz48kgrpzy4xgrq9gr304"], elapsed_blocks: 1000 };
    let tx = await secretjs.tx.compute.instantiateContract(
      {
        // code_id: codeId,
        code_id: 4842,
        sender: wallet.address,
        // code_hash: contractCodeHash,
        code_hash: "e4f7cc9b5c5928d5bd93cd1f3a8d77714c8e76e4e78cc4c49e1141e13afb2043",
        init_msg: initMsg,
        label: "My forth inherit secret contract",
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
      contract_address: "secret1lsjhas7jp7t6pan6r23tc4muffrrh9xcr742kc",
      code_hash: "e4f7cc9b5c5928d5bd93cd1f3a8d77714c8e76e4e78cc4c49e1141e13afb2043",
      // query: { get_password: {
      //   permit: {
      //     params: {
      //       "permit_name": "view my password",
      //       "allowed_tokens": [
      //           "secret1lsjhas7jp7t6pan6r23tc4muffrrh9xcr742kc"
      //       ],
      //       "chain_id": "pulsar-3",
      //       "permissions": []
      //     },
      //     signature: "vMOW+c/wBr8GwYXlin+moTQwmG+aLddDHdyyyPkmI2wo5iAcIY0yGkmUrYy5NgoMTI+4xTC9CZHpOwK6Z1adeA==",
      //   }
      // } },
      query: {
        get_elapsed_block_time: {}
      }
    }).catch(err => console.log(err));
  
    console.log(my_query);
};
  
// try_query();

let try_execute = async () => {
    let tx = await secretjs.tx.compute.executeContract(
      {
        sender: wallet.address,
        contract_address: "secret1lsjhas7jp7t6pan6r23tc4muffrrh9xcr742kc",
        code_hash: "e4f7cc9b5c5928d5bd93cd1f3a8d77714c8e76e4e78cc4c49e1141e13afb2043", // optional but way faster
        msg: {
          reset_white_list: {whitelist: ["secret1yufr2hav2eyaqny9qjulwlqmzg08m9aduc4ly9", "secret1dcufar7e2mj22jaemfz48kgrpzy4xgrq9gr304"]},
        },
      },
      {
        gasLimit: 100_000,
      }
    );
    console.log("executing...");
};
  
// try_execute();