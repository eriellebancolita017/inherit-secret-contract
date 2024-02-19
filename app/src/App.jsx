import './App.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from './pages/HomePage';
import InstantiatePage from './pages/InstantiatePage';
import InteractPage from './pages/InteractPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/instantiate' element={<InstantiatePage />} />
        <Route path='/interact' element={<InteractPage />} />
      </Routes>
    </Router>
  )
}

export default App;
