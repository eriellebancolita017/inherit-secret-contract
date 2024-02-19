import { useContext, useState } from "react";
import Symbol from "../components/Symbol";
import InteractModal from "../components/InteractModal";
import { SecretjsContext } from "../secretJs/SecretjsContext";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const { secretjs, secretAddress } = useContext(SecretjsContext);
  const [openInteractModal, setOpenInteractModal] = useState(false);
  const navigate = useNavigate();
  
  const handleInstantiate = (e) => {
    e.preventDefault();
    
    if (secretjs && secretAddress) {
      navigate("/instantiate");
    } else {
      alert("Please connect the Wallet first!");
    }
  }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8">
      <Symbol />
      <br></br>
      <div className="flex justify-center gap-10 w-full max-w-[768px] mt-10">
        <form onSubmit={handleInstantiate}>
          <button type="submit" className="flex mx-auto mt-2 justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500" >Instance New Contract</button>
        </form>
        <button onClick={() => setOpenInteractModal(!openInteractModal)} className="flex mt-2 justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500" >Interact With Contract</button>
        <InteractModal open={openInteractModal} setOpen={setOpenInteractModal} />
      </div>
    </div>
  )
}

export default HomePage;