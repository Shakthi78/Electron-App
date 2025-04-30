import './App.css'
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Settings from './pages/Settings';
import Controls from './pages/Controls';

function SecondaryApp() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home worldClock={false}/>}/>
        <Route path='/settings' element={<Settings/>}/>
        <Route path='/controls' element={<Controls/>}/>
      </Routes>
    </Router>
  )
}

export default SecondaryApp