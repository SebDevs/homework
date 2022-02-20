import './App.css';
import Homepage from './components/Home';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import Loginpage from './components/Login';
import ProtectedRoute from './components/Protectedroute';
//<Loginpage />

function App() {
  return (
    <Routes>
    <Route excact path="/login" element={<Loginpage />} />
    <Route path="/" element={ <ProtectedRoute Component={Homepage} />}/>
    </Routes>
  );
}

export default App;