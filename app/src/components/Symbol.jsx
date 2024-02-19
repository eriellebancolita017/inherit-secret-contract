import { useContext } from "react";
import { WalletIcon } from "@heroicons/react/24/outline";
import { SecretjsContext } from "../secretJs/SecretjsContext";
import SecretToken from "./SecretToken";

function Symbol() {
  const { connectWallet } = useContext(SecretjsContext);

  return (
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
  )
}

export default Symbol;