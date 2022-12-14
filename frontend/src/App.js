import './App.css';
import { useState } from 'react';
import Header from './components/Header';
import PhotosPage from './components/pages/PhotosPage';
import UserAuthentication from './components/pages/UserAuthentication';
import NewProjectPage from './components/pages/NewProjectPage';
import ViewMosaicPage from './components/pages/ViewMosaicPage';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userId, setUserId] = useState(-1);

  let toDisplay;
  if(loggedIn) {
    toDisplay = 
    // <NewProjectPage userId={userId} />; 
    // <PhotosPage userId={userId} />;
    <ViewMosaicPage userId={userId} />;
  } else {
    toDisplay = <UserAuthentication setLoggedIn={setLoggedIn} setUserId={setUserId}/>; 
  }

  return (
    <div className="App">
      <Header />
      {toDisplay}
    </div>
  );
}

export default App;
