import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import Header from '../components/Header';
import Footer from '../components/Footer';

const NotFound = ({ history }) => {

    const handleOnClick = () => {
        history.push('/');        
    };

    return (
        <React.Fragment>
            <Header />
            <Row>
                <Col className="not-found">
                    <span>NOT FOUND</span>
                    <p>This page does not exist</p>
                    <Button onClick={handleOnClick}>Go back to main page</Button>
                </Col>
            </Row>
            <Footer />
        </React.Fragment>        
    );
};

export default NotFound;