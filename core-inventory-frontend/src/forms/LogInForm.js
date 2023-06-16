import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Field, reduxForm } from 'redux-form';
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import InputForm from '../components/InputForm';

class LogInForm extends PureComponent {

    render() {
        const { submitLogIn, handleSubmit, submitting } = this.props;

        return (                
            <React.Fragment>
                <Row className="justify-content-center justify-content-lg-start">                                
                    <Col className="form">
                        <Form>
                            <Form.Text className="form-title">Log in</Form.Text>
                            <Form.Row>                                                                                                                       
                                <Field name={'name'} component={InputForm} ph={'Username'} type={'text'} />                                                                                                                      
                            </Form.Row>          
                            <Form.Row>
                                <Field name={'password'} component={InputForm} ph={'Password'} type={'password'} />
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
                                <Button type="submit" onClick={handleSubmit(submitLogIn)}>Next</Button>                
                            }                                              
                            <Form.Text className="text-link">Don't have an account? <Link to="/signup">Sign up</Link> </Form.Text>
                        </Form>                                                        
                    </Col>                
                </Row>            
            </React.Fragment>
        );        
    }
}

const mapStateToProps = (state, ownProps) => {    
    return {
        submitting: state.UserReducer.submitting
    };
};

const validate = (values) => {
    
    const errors = {};    
    
    if (!values.name || values.name.trim().length === 0) {
        errors.name = 'Username is required';
    }

    if (!values.password || values.password.trim().length === 0) {
        errors.password = 'Password is required';
    } else if (values.password.length < 6) {
        errors.password = 'Password must be at least 6 characters long';
    }
    
    return errors;
};

LogInForm = connect(mapStateToProps)(LogInForm);

export default reduxForm({ form: 'LogInForm', validate })(LogInForm);