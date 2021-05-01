import React, { Suspense } from 'react';
import { Route, Switch } from "react-router-dom";
import Auth from "../hoc/auth";
// import pages and components
import LandingPage from "./views/LandingPage/LandingPage.js";
import LoginPage from "./views/LoginPage/LoginPage.js";
import PassUpdate from "./views/LoginPage/PassUpdate.js";
import ResetPass from "./views/LoginPage/ResetPass.js";
import RegisterPage from "./views/RegisterPage/RegisterPage.js";
import NavBar from "./views/NavBar/NavBar";
import Footer from "./views/Footer/Footer"
import UploadProductPage from './views/UploadProductPage/UploadProductPage'
import DetailProductPage from './views/DetailProductPage/DetailProductPage';
import OffersPage from './views/OffersPage/OffersPage';
import MyListingsPage from './views/MyListings/MyListingsPage';


function App() {
  return (
    <Suspense fallback={(<div>Loading...</div>)}>
      <NavBar />
      <div style={{ paddingTop: '75px', minHeight: 'calc(100vh - 80px)' }}>
        <Switch>
          <Route exact path="/" component={Auth(LandingPage, null)} />
          <Route exact path="/login" component={Auth(LoginPage, false)} />
          <Route exact path="/changePassword" component={Auth(PassUpdate, true)} />
          <Route exact path="/resetPassword" component={Auth(ResetPass, false)} />
          <Route exact path="/register" component={Auth(RegisterPage, false)} />
          <Route exact path="/sell" component={Auth(UploadProductPage, true)} />
          <Route exact path="/offers" component={Auth(OffersPage, true)} />
          <Route exact path="/mylistings" component={Auth(MyListingsPage, true)} />
          <Route exact path="/listing/:productId" component={Auth(DetailProductPage, null)} />

        </Switch>
      </div>
      <Footer />
    </Suspense>
  );
}

export default App;
