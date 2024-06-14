import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Home } from './pages/home/Home'
import { Host } from './pages/host/Host'
import { Call } from './pages/call/Call'
import { Participant } from './pages/participant/Participant'

import './App.css'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/host" element={<Host />} />
          <Route path="/call" element={<Call />} />
          <Route path="/participant" element={<Participant />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
