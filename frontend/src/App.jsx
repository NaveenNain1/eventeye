import { useState,useCallback,useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
 import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from './pages/login';
import axios from './axios';
import ProtectedRoute from './ProtactedRoute';
import ThemeOutlet from './comps/ThemeOutlet';
import CreateTemplate from './pages/CreateTemplate';
import CustomizeTemplate from './pages/CustomizeTemplate';
import Templates from './pages/Templates';
import BuyCredits from './pages/BuyCredits';
import Credits from './pages/Credits';
import Profile from './pages/Profile';
import TemplatePreview from './pages/TemplatePreview';
import CreatePost from './pages/CreatePost';
import CreatedPostView from './pages/CreatedPostView';
import MyPosts from './pages/MyPosts';
import Landing from './pages/Landing';
import TemplateStudents from './pages/TemplateStudents';

function App() {
  const [count, setCount] = useState(0)
 const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginChecking, setIsLoaginChecking] = useState(true);
  const [user, setUser] = useState({})

 

  const checkIfLoggedIn = useCallback(async () => {
    setIsLoaginChecking(true)
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoggedIn(false);
        return;
      }
      const res = await axios.get('user/data', {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      setIsLoggedIn(true);
      setUser(res.data.data);
      localStorage.setItem('username', res.data.data.name);
    } catch (e) {
      setIsLoggedIn(false);
      localStorage.removeItem('token');
      console.log(e)
    } finally {
      setIsLoaginChecking(false)
    }
  }, []);

  useEffect(() => {
    checkIfLoggedIn();
  }, [checkIfLoggedIn])
 const [pageTitle,setPageTitle] = useState("")
 const [showBackArrow,setShowBackArrow] = useState(false)
   return (
    <Router>
      
      <Routes>
        <Route path="/" element={<> <Login isLoggedIn={isLoggedIn} user={user} checkIfLoggedIn={checkIfLoggedIn} /></>} />
        <Route path="login" element={<> <Login isLoggedIn={isLoggedIn} user={user} checkIfLoggedIn={checkIfLoggedIn} /></>} />
        <Route path="certify/:id" element={<> <CreatedPostView  setPageTitle={setPageTitle} setShowBackArrow={setShowBackArrow} isLoggedIn={isLoggedIn} user={user} checkIfLoggedIn={checkIfLoggedIn} /></>} />
        <Route path="certify:id" element={<> <CreatedPostView  setPageTitle={setPageTitle} setShowBackArrow={setShowBackArrow} isLoggedIn={isLoggedIn} user={user} checkIfLoggedIn={checkIfLoggedIn} /></>} />
   <Route path='user' element={<ProtectedRoute isLoggedIn={isLoggedIn} isLoginChecking={isLoginChecking} ><ThemeOutlet user={user} pageTitle={pageTitle} showBackArrow={showBackArrow} /></ProtectedRoute>}>
<Route path='templates' element={<Templates setPageTitle={setPageTitle} setShowBackArrow={setShowBackArrow}/>}/>
<Route path='create-template' element={<CreateTemplate setPageTitle={setPageTitle} setShowBackArrow={setShowBackArrow}/>}/>
<Route path='buy-credits' element={<BuyCredits setPageTitle={setPageTitle} setShowBackArrow={setShowBackArrow}/>}/>
<Route path='credits' element={<Credits setPageTitle={setPageTitle} setShowBackArrow={setShowBackArrow}/>}/>
<Route path='profile' element={<Profile setPageTitle={setPageTitle} setShowBackArrow={setShowBackArrow}/>}/>
<Route path='templates/customize/:id' element={<CustomizeTemplate setPageTitle={setPageTitle} setShowBackArrow={setShowBackArrow}/>}/>
<Route path='templates/view/:id' element={<TemplatePreview setPageTitle={setPageTitle} setShowBackArrow={setShowBackArrow}/>}/>
<Route path='create-post' element={<CreatePost setPageTitle={setPageTitle} setShowBackArrow={setShowBackArrow}/>}/>
<Route path='posts' element={<MyPosts setPageTitle={setPageTitle} setShowBackArrow={setShowBackArrow}/>}/>
<Route path='post/:id' element={<CreatedPostView setPageTitle={setPageTitle} setShowBackArrow={setShowBackArrow}/>}/>
   
<Route path='templates/students/:templateId' element={<TemplateStudents setPageTitle={setPageTitle} setShowBackArrow={setShowBackArrow}/>}/>
    
   </Route>
      </Routes>
    </Router>
  );
 
}

export default App
