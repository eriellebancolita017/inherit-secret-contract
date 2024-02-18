import { useContext } from "react";
import { SecretjsContext } from "./SecretjsContext";

let contractCodeHash =
"0f2dce4850331b3596970b9cac8264a2a08ea4982cc67addf17946bff6feacd7";
let contractAddress = "secret1lekjax247leuysfplejwk2zx8xmdc9kl3fjsur";

const SecretjsFunctions = () => {
  const { secretjs, secretAddress } = useContext(SecretjsContext);

  let get_elapsed_block_time = async () => {
    const query = await secretjs.query.compute.queryContract({
      contract_address: contractAddress,
      code_hash: contractCodeHash,
      query: { get_elapsed_block_time: {} },
    });

    console.log(query);
    return query
  };

  let get_contract_info = async () => {
    const query = await secretjs.query.compute.contractInfo({
      contract_address: contractAddress,
      code_hash: contractCodeHash,
    });

    console.log(query)

    return query
  }

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

    console.log(set_password_tx)
  }

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

    console.log(set_block_time_tx)
  }

  // let submit_net_worth = async (millionaire1, millionaire2) => {
  //   const millionaire1_tx = new MsgExecuteContract({
  //     sender: secretAddress,
  //     contract_address: contractAddress,
  //     msg: {
  //       submit_net_worth: {
  //         name: millionaire1.name,
  //         worth: parseInt(millionaire1.networth),
  //       },
  //     },
  //     code_hash: contractCodeHash,
  //   });

  //   const millionaire2_tx = new MsgExecuteContract({
  //     sender: secretAddress,
  //     contract_address: contractAddress,
  //     msg: {
  //       submit_net_worth: {
  //         name: millionaire2.name,
  //         worth: parseInt(millionaire2.networth),
  //       },
  //     },
  //     code_hash: contractCodeHash,
  //   });
  //   const txs = await secretjs.tx.broadcast(
  //     [millionaire1_tx, millionaire2_tx],
  //     {
  //       gasLimit: 300_000,
  //     }
  //   );
  //   console.log(txs);
  // };
  // // submit_net_worth(millionaire1, millionaire2);

  // let reset_net_worth = async () => {
  //   const tx = await secretjs.tx.compute.executeContract(
  //     {
  //       sender: secretAddress,
  //       contract_address: contractAddress,
  //       msg: {
  //         reset: {},
  //       },
  //       code_hash: contractCodeHash,
  //     },
  //     { gasLimit: 100_000 }
  //   );

  //   console.log(tx);
  // };
  // // reset_net_worth();

  // let query_net_worth = async (myQuery) => {
  //   let query = await secretjs.query.compute.queryContract({
  //     contract_address: contractAddress,
  //     query: {
  //       who_is_richer: {},
  //     },
  //     code_hash: contractCodeHash,
  //   });

  //   myQuery.push(query);

  //   console.log(myQuery);
  // };
  // //   query_net_worth();
  return {
    get_elapsed_block_time,
    set_net_password,
    set_elapsed_block_time,
    get_contract_info,
    // submit_net_worth,
    // reset_net_worth,
    // query_net_worth,
  };
};

export { SecretjsFunctions };