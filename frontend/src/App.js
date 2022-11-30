import './App.css';
import { useState } from 'react';
import Header from './components/Header';
import Photos from './components/pages/Photos';
import UserAuthentication from './components/pages/UserAuthentication';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userId, setUserId] = useState(-1);

  let toDisplay;
  if(loggedIn) {
    toDisplay = <Photos userId={userId} />;
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
