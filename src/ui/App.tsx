import './App.css'
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/settings' element={<Settings/>}/>
      </Routes>
    </Router>
  )
}

export default App
