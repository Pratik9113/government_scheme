import React from 'react'
import MyScheme from './components/myscheme'
import { BrowserRouter as Router } from 'react-router-dom';
const App = () => {
  return (
    <Router>
    <div>
      <MyScheme />
    </div>
    </Router>
  )
}

export default App