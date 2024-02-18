import { useContext, useEffect, useState } from "react";
import SecretToken from "./SecretToken";
import { WalletIcon } from "@heroicons/react/24/outline";
import { SecretjsContext } from "../secretJs/SecretjsContext";
import { SecretjsFunctions } from "../secretJs/SecretjsFunctions";

function InheritForm({
  whitelist,
  setWhitelist,
  elapsedBlockTime,
  setElapsedBlockTime,
  password,
  SetPassword
}) {
  const { connectWallet, secretjs, secretAddress } = useContext(SecretjsContext);

  const { get_elapsed_block_time, set_net_password, set_elapsed_block_time, get_contract_info } =
    SecretjsFunctions();

  const [elapsedTime, setElapsedTime] = useState(0);
  const [myPassword, setMyPassword] = useState("");
  const [contractAddr, setContractAddr] = useState("");
  const [contractInfo, setContractInfo] = useState();

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
      SetPassword(myPassword);
      await set_net_password(myPassword);
    } catch (error) {
      alert("Please approve the transaction in keplr.");
    }
  }

  const getElapsedBlockTime = async (e) => {
    e.preventDefault();

    try {
      const elapsedBlockTime = await get_elapsed_block_time();
      console.log(elapsedBlockTime);
      setElapsedTime(elapsedBlockTime.elapsed_blocks);
    } catch (error) {
      alert("Please approve the transaction in keplr.");
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
              <div className="flex items-center justify-between ">
                <label className="block text-sm font-medium leading-6 text-white">
                  Contract Address
                </label>
              </div>

              <div className="mt-2">
                <input
                  type="text"
                  value={contractAddr}
                  onChange={(e) => setContractAddr(e.target.value)}
                  placeholder="Input the contract address"
                  required
                  className="block w-full rounded-md border-0 bg-white/5
                py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10
                focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm
                sm:leading-6"
                />
              </div>
              <div className="flex items-center justify-between mt-2">
                <label className="block text-sm font-medium leading-6 text-white">
                  Elapsed Block Time
                </label>
              </div>

              <div className="mt-2">
                <input
                  type="text"
                  value={elapsedTime}
                  placeholder="Name of Millionaire 1"
                  disabled
                  className="block w-full rounded-md border-0 bg-white/5
                py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10
                focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm
                sm:leading-6"
                />
              </div>
              <button onClick={getElapsedBlockTime} className="flex w-full mx-auto mt-2 justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                Get Elapsed Block Time
              </button>
            </div>
          </div>

          <br></br>

          {contractInfo && contractInfo.contract_info?.creator === secretAddress &&
            (
              <div className="space-y-2">
                <p className="text-white">Owner</p>
                <div className="border-4 rounded-lg p-2 ">
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
      {/* <RicherModal
        richerModalOpen={richerModalOpen}
        setRicherModalOpen={setRicherModalOpen}
        myQuery={myQuery}
      />
      <ResetModal
        resetModalOpen={resetModalOpen}
        setResetModalOpen={setResetModalOpen}
      /> */}
    </>
  );
}

export default InheritForm;