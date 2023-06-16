import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Field, reduxForm } from 'redux-form';
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import InputForm from '../components/InputForm';

class SignUpForm extends PureComponent {

    render() {
        const { submitSignUp, handleSubmit, submitting } = this.props;

        return (
            <React.Fragment>
                <Row className="justify-content-center">                                
                    <Col xs={12} className="form">
                        <Form>
                            <Form.Text className="form-title">Sign up</Form.Text>
                            <Form.Row>
                                <Field component={InputForm} name={'name'} ph={'Username'} type={'text'} />
                            </Form.Row>
                            <Form.Row>
                                <Field component={InputForm} name={'password'} ph={'Password'} type={'password'} />
                            </Form.Row>
                            {
                                submitting ? 
                                <Button type="submit" disabled style={{ cursor: 'default' }}>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />
                                </Button> :
                                <Button type="submit" onClick={handleSubmit(submitSignUp)}>Next</Button>                                
                            }                            
                            <Form.Text className="text-link">Already have an account? <Link to="/">Log in</Link> </Form.Text>               
                        </Form>
                    </Col>                
                </Row>
            </React.Fragment>
        );        
    }
}

const mapStatToProps = (state, ownProps) => {    
    return {
        submitting: state.UserReducer.submitting
    };
};

const validate = (values) => {
    
    const errors = {}

    if(!values.name || values.name.trim().length === 0) {
        errors.name = 'Username is required';
    }
    
    if(!values.password || values.password.trim().length === 0) {
        errors.password = 'Password is required';
    } else if (values.password.length < 6) {
        errors.password = 'Password must be at least 6 characters long';
    }

    return errors;
};

SignUpForm = connect(mapStatToProps)(SignUpForm);

export default reduxForm({ form: 'SignUpForm', validate })(SignUpForm);