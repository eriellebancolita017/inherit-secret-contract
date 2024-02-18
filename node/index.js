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
    // Create an instance of the Inherit contract, providing a initial Message
    const initMsg = { password: "test", whitelist: ["secret1dcufar7e2mj22jaemfz48kgrpzy4xgrq9gr304"], elapsed_blocks: 1000 };
    let tx = await secretjs.tx.compute.instantiateContract(
      {
        // code_id: codeId,
        code_id: 4462,
        sender: wallet.address,
        // code_hash: contractCodeHash,
        code_hash: "0f2dce4850331b3596970b9cac8264a2a08ea4982cc67addf17946bff6feacd7",
        init_msg: initMsg,
        label: "My second inherit secret contract",
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
  
instantiate_contract();

let try_query = async () => {
    const my_query = await secretjs.query.compute.queryContract({
    //   contract_address: contract_address,
    //   code_hash: contractCodeHash,
      contract_address: "secret1946v0ffcyw38cuj2aklzsadtcjrhjha0u39swh",
      code_hash: "0f2dce4850331b3596970b9cac8264a2a08ea4982cc67addf17946bff6feacd7",
      query: { get_password: {
        permit: {
          params: {
            "permit_name": "view my password",
            "allowed_tokens": [
                "secret1946v0ffcyw38cuj2aklzsadtcjrhjha0u39swh"
            ],
            "chain_id": "pulsar-3",
            "permissions": []
          },
          signature: "vMOW+c/wBr8GwYXlin+moTQwmG+aLddDHdyyyPkmI2wo5iAcIY0yGkmUrYy5NgoMTI+4xTC9CZHpOwK6Z1adeA==",
        }
      } },
    }).catch(err => console.log(err));
  
    console.log(my_query);
};
  
// try_query();

let try_execute = async () => {
    let tx = await secretjs.tx.compute.executeContract(
      {
        sender: wallet.address,
        contract_address: "secret1946v0ffcyw38cuj2aklzsadtcjrhjha0u39swh",
        code_hash: "0f2dce4850331b3596970b9cac8264a2a08ea4982cc67addf17946bff6feacd7", // optional but way faster
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