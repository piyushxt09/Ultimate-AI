import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Dashboard from './layouts/Dashboard'
import Navbar from './components/Navbar'
import Signup from './LoginPages/Signup';
import Login from './LoginPages/Login';
import Home from './components/Home';


function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<> <Navbar /> <Home /></>} />
        <Route path="/dashboard" element={<><Navbar/> <Dashboard /></>} />
        <Route path="/login" element={<><Navbar/> <Login /></>} />
        <Route path="/sign-up" element={<><Navbar/> <Signup /></>} />

      </Routes>
    </Router>
  )
}

export default App
