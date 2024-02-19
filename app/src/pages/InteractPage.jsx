import { useState } from 'react'
import InteractForm from '../components/InteractForm';

function InteractPage() {
  const [whitelist, setWhitelist] = useState([]);
  const [elapsedBlockTime, setElapsedBlockTime] = useState(0);
  const [password, setPassword] = useState("");

  return (
    <div className='App'>
      <InteractForm
        whitelist={whitelist}
        setWhitelist={setWhitelist}
        elapsedBlockTime={elapsedBlockTime}
        setElapsedBlockTime={setElapsedBlockTime}
        password={password}
        setPassword={setPassword}
      />
    </div>
  )
}

export default InteractPage;