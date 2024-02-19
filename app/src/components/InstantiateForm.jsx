import { useState } from "react";
import { SecretjsFunctions } from "../secretJs/SecretjsFunctions";

function InstantiateForm() {
  const [password, setPassword] = useState("");
  const [elapsedBlocks, setElapsedBlocks] = useState(0);
  const [whitelist, setWhitelist] = useState([]);
  const [contractAddress, setContractAddress] = useState("");

  const { instantiate_contract } = SecretjsFunctions();
  const handleInstantiate = async (e) => {
    e.preventDefault();

    try {
      const response = await instantiate_contract({ password, elapsedBlocks, whitelist });
      console.log(response);
      setContractAddress(response);
    } catch (error) {
      alert(error);
    }
  }

  const handleWhitelist = (e) => {
    if (e.target.value != "") {
      setWhitelist(e.target.value.split(",").map(str => str.trim()))
    }
  }

  return (
    <div className="space-y-2">
      {
        contractAddress && <div className="text-center tracking-tight text-white">
          <p>
            Contract Instantiate successfully.
          </p>
          <p>
            The contract address is "{contractAddress}".
          </p>
        </div>
      }
      <div className="border-4 w-full max-w-3xl rounded-lg p-2 ">
        <form onSubmit={handleInstantiate}>
          <div className="flex items-center justify-between ">
            <label className="block text-sm font-medium leading-6 text-white">
              Set Password
            </label>
          </div>

          <div className="mt-2">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter the password"
              required
              className="block w-full rounded-md border-0 bg-white/5
          py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10
          focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm
          sm:leading-6"
            />
          </div>

          <div className="flex items-center justify-between ">
            <label className="block text-sm font-medium leading-6 text-white">
              Set Elapsed Blocks
            </label>
          </div>

          <div className="mt-2">
            <input
              type="number"
              value={elapsedBlocks}
              onChange={(e) => setElapsedBlocks(e.target.value)}
              placeholder="Enter the elapsed blocks"
              required
              className="block w-full rounded-md border-0 bg-white/5
          py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10
          focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm
          sm:leading-6"
            />
          </div>

          <div className="flex items-center justify-between ">
            <label className="block text-sm font-medium leading-6 text-white">
              Set Whitelist
            </label>
          </div>

          <div className="mt-2">
            <input
              type="text"
              value={whitelist.join(", ")}
              onChange={handleWhitelist}
              placeholder="Enter the addresses dividing by comma"
              required
              className="block w-full rounded-md border-0 bg-white/5
          py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10
          focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm
          sm:leading-6"
            />
          </div>
          <button type="submit" className="flex w-full mx-auto mt-2 justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
            Instantiate Contract
          </button>
        </form>
      </div>
    </div>
  )
}

export default InstantiateForm;