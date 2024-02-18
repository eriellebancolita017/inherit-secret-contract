import { useContext } from "react";
import { SecretjsContext } from "./SecretjsContext";

let contractCodeHash =
  "0f2dce4850331b3596970b9cac8264a2a08ea4982cc67addf17946bff6feacd7";
let contractAddress = "secret1946v0ffcyw38cuj2aklzsadtcjrhjha0u39swh";

const SecretjsFunctions = () => {
  const { secretjs, secretAddress } = useContext(SecretjsContext);

  let get_contract_info = async () => {
    const query = await secretjs.query.compute.contractInfo({
      contract_address: contractAddress,
      code_hash: contractCodeHash
    });

    console.log(query);

    return query;
  };

  let get_elapsed_block_time = async () => {
    const query = await secretjs.query.compute.queryContract({
      contract_address: contractAddress,
      code_hash: contractCodeHash,
      query: { get_elapsed_block_time: {} },
    });

    console.log(query);
    return query;
  };

  let get_net_password = async (data) => {
    console.log("permit => ", data)
    const query = await secretjs.query.compute.queryContract({
      contract_address: contractAddress,
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
        contract_address: contractAddress,
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
        contract_address: contractAddress,
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

  let set_white_list = async (whitelist) => {
    const set_whitelist_tx = await secretjs.tx.compute.executeContract(
      {
        sender: secretAddress,
        contract_address: contractAddress,
        msg: {
          reset_white_list: {
            whitelist: whitelist
          }
        },
        code_hash: contractCodeHash,
      },
      {
        gasLimit: 100_000,
      }
    );

    console.log(set_whitelist_tx);
  }

  return {
    get_elapsed_block_time,
    get_contract_info,
    get_net_password,
    set_net_password,
    set_elapsed_block_time,
    set_white_list,
  };
};

export { SecretjsFunctions };