import React, { PureComponent } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { signUp, getSession, setPathname } from '../actions/users';
import { Col, Row } from 'react-bootstrap';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SignUpForm from '../forms/SignUpForm';

class SignUp extends PureComponent {

    componentDidMount() {
        const { getSession, setPathname } = this.props;
        getSession();
        setPathname('/signup');
        window.scrollTo(0, 0);
    }

    handleSubmitSignUp = (data) => {
        this.props.signUp(data);
    };
    
    render() {
        const { session } = this.props;
        
        if (session) 
            return <Redirect to={{ pathname: '/inventory'}} />

        return (
            <React.Fragment>
                <Header />      
                <Row className="sign-up justify-content-center">
                    <Col xs={12} className="sign-up-form">
                        <SignUpForm submitSignUp={this.handleSubmitSignUp} />                
                    </Col>                    
                </Row>
                <Footer />               
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        session: state.UserReducer.session
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        signUp: (data) => dispatch(signUp(data)),
        getSession: () => dispatch(getSession),
        setPathname: (pathname) => dispatch(setPathname(pathname))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);