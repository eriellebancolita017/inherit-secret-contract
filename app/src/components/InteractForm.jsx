import { useContext, useEffect, useState } from "react";
import SecretToken from "./SecretToken";
import { WalletIcon } from "@heroicons/react/24/outline";
import { SecretjsContext } from "../secretJs/SecretjsContext";
import { SecretjsFunctions } from "../secretJs/SecretjsFunctions";
import { useNavigate } from "react-router-dom";

function InteractForm({
  whitelist,
  setWhitelist,
  elapsedBlockTime,
  setElapsedBlockTime,
  password,
  setPassword
}) {
  const { connectWallet, secretjs, secretAddress, contractAddr } = useContext(SecretjsContext);
  const navigate = useNavigate();
  const { get_elapsed_block_time, set_net_password, set_elapsed_block_time, get_contract_info, get_net_password, set_white_list, get_white_list } =
    SecretjsFunctions();

  const [elapsedTime, setElapsedTime] = useState({});
  const [myPassword, setMyPassword] = useState("");
  const [contractInfo, setContractInfo] = useState();
  const [signature, setSignature] = useState(null);
  const [myWhiteList, setMyWhiteList] = useState([]);

  const permitName = "view my password";
  const chainId = "pulsar-3";
  const allowedTokens = [contractAddr];

  const viewingPermit = (e) => {
    e.preventDefault();
    const create_viewing_permit = async () => {
      const { signature } = await window.keplr.signAmino(
        chainId,
        secretAddress,
        {
          chain_id: chainId,
          account_number: "0", // Must be 0
          sequence: "0", // Must be 0
          fee: {
            amount: [{ denom: "uscrt", amount: "0" }], // Must be 0 uscrt
            gas: "1", // Must be 1
          },
          msgs: [
            {
              type: "query_permit", // Must be "query_permit"
              value: {
                permit_name: permitName,
                allowed_tokens: allowedTokens,
                permissions: [],
              },
            },
          ],
          memo: "", // Must be empty
        },
        {
          preferNoSetFee: true, // Fee must be 0, so hide it from the user
          preferNoSetMemo: true, // Memo must be empty, so hide it from the user
        }
      );
      setSignature(signature);
      console.log(signature);
    };

    create_viewing_permit();
  }


  useEffect(() => {
    if (secretjs && secretAddress) {
      const getInfo = async () => {
        try {
          const info = await get_contract_info();
          return info;
        } catch (error) {
          alert("Please approve the transaction in keplr.");
        }
      }
      getInfo().then(info => {
        if (info) {
          setContractInfo(info);
          console.log(info.contract_info);
        }
      });
    }
  }, [connectWallet, secretjs, secretAddress]);


  useEffect(() => {
    if(contractAddr.length === 0) {
      navigate("/");
    }
  }, []);

  const handleSubmitElapsedBlockTime = async (e) => {
    e.preventDefault();
    try {
      console.log("elapsedBlockTime => ", elapsedBlockTime)

      await set_elapsed_block_time(Number(elapsedBlockTime));
    } catch (error) {
      alert("Please approve the transaction in keplr.");
    }
  };

  const handleSetPassword = async (e) => {
    e.preventDefault();
    try {
      await set_net_password(password);
    } catch (error) {
      alert("Please approve the transaction in keplr.");
    }
  };

  const handleSetWhilteList = async (e) => {
    e.preventDefault();
    try {
      await set_white_list(myWhiteList);
    } catch (error) {
      alert("Please approve the transaction in keplr.");
    }
  }

  const getElapsedBlockTime = async (e) => {
    e.preventDefault();

    try {
      const elapsedBlockTime = await get_elapsed_block_time();
      console.log(elapsedBlockTime);
      setElapsedTime(elapsedBlockTime);
    } catch (error) {
      alert("Please approve the transaction in keplr.");
    }
  };

  const getNetPassword = async (e) => {
    e.preventDefault();

    try {
      const permit = {
        params: {
          permit_name: permitName,
          allowed_tokens: allowedTokens,
          chain_id: "pulsar-3",
          permissions: [],
        },
        signature: signature,
      }
      const netPassword = await get_net_password({permit});
      console.log(netPassword);
      if (netPassword.password) {
        setMyPassword(netPassword.password);
      } else {
        alert(netPassword);
      }
    } catch (error) {
      alert("Please approve the transaction in keplr!");
      console.log(error)
    }
  }

  const getWhiteList = async (e) => {
    e.preventDefault();

    try {
      const response = await get_white_list();
      console.log(response);
      setWhitelist(response.whitelist);
    } catch (error) {
      alert("Please approve the transaction in keplr.");
    }
  }

  const handleWhiteList = (e) => {
    if(e.target.value != "") {
      setMyWhiteList(e.target.value.split(",").map(str => str.trim()))
    }
  }

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="flex justify-end -mb-4 ">
            <WalletIcon
              onClick={connectWallet}
              className="h-10 w-10 text-white hover:text-indigo-500  "
            />
          </div>
          <SecretToken className="mb-2 " />
          <h2 className=" -mt-8 -mb-12 text-center text-2xl font-bold leading-9 tracking-tight text-white">
            Secret Inherit
          </h2>
        </div>

        <br></br>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm ">
          <div className="space-y-2">
            <p className="text-white">Guest</p>
            <div className="border-4 rounded-lg p-2 ">
              <div className="flex flex-col items-center justify-between mt-2">
                <p className="block w-full text-sm font-medium leading-6 text-white">
                  Elapsed Block Time: {elapsedTime?.elapsed_blocks}
                </p>
                <p className="block w-full text-sm font-medium leading-6 text-white">
                  Current Block Time: {elapsedTime?.current_blocks}
                </p>
                <p className="block w-full text-sm font-medium leading-6 text-white">
                  Estimated Block Time: {elapsedTime?.estimate_blocks}
                </p>
              </div>
              <button onClick={getElapsedBlockTime} className="flex w-full mx-auto mt-2 justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                Get Time List
              </button>

              <div className="mt-2">
                <input
                  type="text"
                  value={myPassword}
                  placeholder="Get Password"
                  disabled
                  className="block w-full rounded-md border-0 bg-white/5
                py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10
                focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm
                sm:leading-6"
                />
              </div>
              <button onClick={getNetPassword} className="flex w-full mx-auto mt-2 justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                Get Password
              </button>

              <form onSubmit={viewingPermit}>
                <button type="submit" className="flex w-full mx-auto mt-2 justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                  Check Permit
                </button>
              </form>
            </div>
          </div>

          <br></br>

          {contractInfo && contractInfo.contract_info?.creator === secretAddress &&
            (
              <div className="space-y-2">
                <p className="text-white">Owner</p>
                <div className="border-4 rounded-lg p-2 space-y-4">
                <p className="block w-full text-sm font-medium leading-6 text-white">
                  Whitelist: {whitelist && ('[' + whitelist.join(", ") + ']')}
                </p>
                  <button onClick={getWhiteList} className="flex w-full mx-auto mt-2 justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                    Get Whitelist
                  </button>
                  <form onSubmit={handleSubmitElapsedBlockTime}>
                    <div className="flex items-center justify-between ">
                      <label className="block text-sm font-medium leading-6 text-white">
                        Set Elapsed Block Time
                      </label>
                    </div>

                    <div className="mt-2">
                      <input
                        type="text"
                        value={elapsedBlockTime}
                        onChange={(e) => setElapsedBlockTime(e.target.value)}
                        placeholder="Input the elapsed block time"
                        required
                        className="block w-full rounded-md border-0 bg-white/5
                    py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10
                    focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm
                    sm:leading-6"
                      />
                    </div>
                    <button type="submit" className="flex w-full mx-auto mt-2 justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                      Set Elapsed Block Time
                    </button>
                  </form>

                  <form onSubmit={handleSetPassword}>
                    <div className="flex items-center justify-between ">
                      <label className="block text-sm font-medium leading-6 text-white">
                        Set Inherit Password
                      </label>
                    </div>

                    <div className="mt-2">
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Input the password"
                        required
                        className="block w-full rounded-md border-0 bg-white/5
                    py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10
                    focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm
                    sm:leading-6"
                      />
                    </div>
                    <button type="submit" className="flex w-full mx-auto mt-2 justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                      Set Inherit Password
                    </button>
                  </form>

                  <form onSubmit={handleSetWhilteList}>
                    <div className="flex items-center justify-between ">
                      <label className="block text-sm font-medium leading-6 text-white">
                        Set Whitelist
                      </label>
                    </div>

                    <div className="mt-2">
                      <input
                        type="text"
                        value={myWhiteList.join(", ")}
                        onChange={handleWhiteList}
                        placeholder="Input the addresses dividing by comma"
                        required
                        className="block w-full rounded-md border-0 bg-white/5
                    py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10
                    focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm
                    sm:leading-6"
                      />
                    </div>
                    <button type="submit" className="flex w-full mx-auto mt-2 justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                      Set Whitelist
                    </button>
                  </form>
                </div>
              </div>
            )
          }

          <p className="mt-10 text-center text-sm text-gray-400">
            Built on{" "}
            <a
              href="https://github.com/eriellebancolita017"
              className="font-semibold leading-6 text-indigo-400 hover:text-indigo-300"
            >
              Ghost.
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

export default InteractForm;