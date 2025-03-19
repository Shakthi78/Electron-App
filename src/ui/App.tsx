import './App.css'
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Settings from './pages/Settings';
import Controls from './pages/Controls';
import WhiteBoard from './components/WhiteBoard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/settings' element={<Settings/>}/>
        <Route path='/controls' element={<Controls/>}/>
        <Route path='/whiteboard' element={<WhiteBoard />}/>
      </Routes>
    </Router>
  )
}

export default App
