import { useContext } from "react";
import { SecretjsContext } from "./SecretjsContext";

let contractCodeHash =
  "e4f7cc9b5c5928d5bd93cd1f3a8d77714c8e76e4e78cc4c49e1141e13afb2043";

const SecretjsFunctions = () => {
  const { secretjs, secretAddress, contractAddr } = useContext(SecretjsContext);

  let instantiate_contract = async ({ password, elapsedBlocks, whitelist }) => {
    const initMsg = { password: password, whitelist: [...whitelist, secretAddress], elapsed_blocks: Number(elapsedBlocks) };
    console.log("initMsg => ", initMsg)
    let tx = await secretjs.tx.compute.instantiateContract(
      {
        code_id: 4842,
        sender: secretAddress,
        code_hash: "e4f7cc9b5c5928d5bd93cd1f3a8d77714c8e76e4e78cc4c49e1141e13afb2043",
        init_msg: initMsg,
        label: "Inherit Secret Contract" + Math.ceil(Math.random() * 10000),
      },
      {
        gasLimit: 400_000,
      }
    );

    //Find the contract_address in the logs
    const contractAddress = tx.arrayLog.find(
      (log) => log.type === "message" && log.key === "contract_address"
    ).value;

    return contractAddress;
  }

  let get_contract_info = async () => {
    const query = await secretjs.query.compute.contractInfo({
      contract_address: contractAddr,
      code_hash: contractCodeHash
    });

    console.log(query);

    return query;
  };

  let get_elapsed_block_time = async () => {
    const query = await secretjs.query.compute.queryContract({
      contract_address: contractAddr,
      code_hash: contractCodeHash,
      query: { get_elapsed_block_time: {} },
    });

    console.log(query);
    return query;
  };

  let get_white_list = async () => {
    const query = await secretjs.query.compute.queryContract({
      contract_address: contractAddr,
      code_hash: contractCodeHash,
      query: { get_white_list: {} },
    });

    return query;
  }

  let get_net_password = async (data) => {
    console.log("permit => ", data)
    const query = await secretjs.query.compute.queryContract({
      contract_address: contractAddr,
      code_hash: contractCodeHash,
      query: {
        get_password: {
          permit: data.permit
        }
      }
    });

    console.log(query);
    return query;
  };

  let set_elapsed_block_time = async (elapsedBlocks) => {
    const set_block_time_tx = await secretjs.tx.compute.executeContract(
      {
        sender: secretAddress,
        contract_address: contractAddr,
        msg: {
          set_elapsed_block_time: {
            elapsed_blocks: elapsedBlocks
          }
        },
        code_hash: contractCodeHash,
      },
      {
        gasLimit: 100_000,
      }
    );

    console.log(set_block_time_tx);
  };


  let set_net_password = async (password) => {
    const set_password_tx = await secretjs.tx.compute.executeContract(
      {
        sender: secretAddress,
        contract_address: contractAddr,
        msg: {
          set_password: {
            password: password
          }
        },
        code_hash: contractCodeHash,
      },
      {
        gasLimit: 100_000,
      }
    );

    console.log(set_password_tx);
  };

  let add_white_list = async (guest) => {
    const add_whitelist_tx = await secretjs.tx.compute.executeContract(
      {
        sender: secretAddress,
        contract_address: contractAddr,
        msg: {
          add_white_list: {
            guest: guest
          }
        },
        code_hash: contractCodeHash,
      },
      {
        gasLimit: 100_000,
      }
    );

    console.log(add_whitelist_tx);

    if (add_whitelist_tx.rawLog && !add_whitelist_tx.arrayLog) {
      alert(add_whitelist_tx.rawLog);
    }
  }

  let remove_white_list = async (guest) => {
    const remove_whitelist_tx = await secretjs.tx.compute.executeContract(
      {
        sender: secretAddress,
        contract_address: contractAddr,
        msg: {
          remove_white_list: {
            guest: guest
          }
        },
        code_hash: contractCodeHash,
      },
      {
        gasLimit: 100_000,
      }
    );

    console.log(remove_whitelist_tx);
    if (remove_whitelist_tx.rawLog && !remove_whitelist_tx.arrayLog) {
      alert(remove_whitelist_tx.rawLog);
    }
  }

  let set_white_list = async (whitelist) => {
    const set_whitelist_tx = await secretjs.tx.compute.executeContract(
      {
        sender: secretAddress,
        contract_address: contractAddr,
        msg: {
          reset_white_list: {
            whitelist: [...whitelist, secretAddress]
          }
        },
        code_hash: contractCodeHash,
      },
      {
        gasLimit: 100_000,
      }
    );

    console.log(set_whitelist_tx);
    if (set_whitelist_tx.rawLog && !set_whitelist_tx.arrayLog) {
      alert(set_whitelist_tx.rawLog);
    }
  }

  return {
    instantiate_contract,
    get_elapsed_block_time,
    get_contract_info,
    get_net_password,
    get_white_list,
    set_net_password,
    set_elapsed_block_time,
    add_white_list,
    remove_white_list,
    set_white_list,
  };
};

export { SecretjsFunctions };