
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './Pages/Home';
import Signin from './Pages/Signin';
import About from './Pages/About';
import Signup from './Pages/Signup';
import Profile from './Pages/Profile';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';

export default function App() {
  return(  
     <BrowserRouter>

<Header />


  <Routes>
   <Route path='/' element = {<Home />}></Route>
   <Route path='about' element = {<About/>}></Route>
   <Route path='signin' element = {<Signin />}></Route>
   <Route path='signup' element = {<Signup/>}></Route>
 <Route element = {<PrivateRoute />}>  
   <Route path='/Profile' element = {<Profile />} />
   </Route> 
  </Routes>
  </BrowserRouter>
  )
}
