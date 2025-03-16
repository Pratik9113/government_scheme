import React from 'react'
import MyScheme from './components/myscheme'
import FarmerAssistant from './components/FarmerAssistant';
import { BrowserRouter as Router } from 'react-router-dom';
const App = () => {
  return (
    <Router>
    <div>
      <MyScheme />
      <FarmerAssistant />
    </div>
    </Router>
  )
}

export default App