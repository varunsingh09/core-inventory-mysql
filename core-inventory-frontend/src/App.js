import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import { Container } from 'react-bootstrap';
import './scss/Styles.scss';
import LandingPage from './pages/LandingPage';
import SignUp from './pages/SignUp';
import Inventory from './pages/Inventory';
import Item from './pages/Item';
import Categories from './pages/Categories';
import CreateItem from './pages/CreateItem';
import EditItem from './pages/EditItem';
import NotFound from './pages/NotFound';

const App = () => {
    return (
        <Container fluid>
            <BrowserRouter>
                <Switch>                
                    <Route exact path="/" component={LandingPage} />
                    <Route exact path="/signup" component={SignUp} />
                    <Route exact path="/inventory" component={Inventory} />  
                    <Route exact path="/items/:id" component={Item} />
                    <Route exact path="/categories" component={Categories} />                    
                    <Route exact path="/create-item" component={CreateItem} />
                    <Route exact path="/edit-item/:id" component={EditItem} />
                    <Route component={NotFound} />
                </Switch>
        </BrowserRouter> 
       </Container>       
    );
};

export default (App);