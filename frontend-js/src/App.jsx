import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HomePage as Home } from './pages/HomePage'
import { HostPage as Host } from './pages/HostPage'
import { CallPage as Call } from './pages/CallPage'
import { ParticipantPage as Participant } from './pages/ParticipantPage'

import './App.css'

const App = () => {
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
