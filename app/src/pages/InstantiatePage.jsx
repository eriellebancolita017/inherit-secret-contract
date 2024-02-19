import InstantiateForm from "../components/InstantiateForm";
import Symbol from "../components/Symbol";

function InstantiatePage() {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8">
      <Symbol />
      <br></br>
      <div className="mt-10 w-full max-w-2xl">
        <InstantiateForm />
      </div>
    </div>
  )
}

export default InstantiatePage;