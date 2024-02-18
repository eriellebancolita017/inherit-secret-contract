import { useState } from 'react'
import './App.css'
import InheritForm from './components/InheritForm';

function App() {
  const [whitelist, setWhitelist] = useState([]);
  const [elapsedBlockTime, setElapsedBlockTime] = useState(0);
  const [password, setPassword] = useState("");

  return (
    <div className='App'>
      <InheritForm
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

export default App
