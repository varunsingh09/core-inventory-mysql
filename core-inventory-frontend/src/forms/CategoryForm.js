import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import InputForm from '../components/InputForm';

const validate = (values) => {

    const errors = {};        
     
    if (!values.name || values.name.trim().length === 0) {
        errors.name = 'Category name is required';
    }

    return errors;
};

const CategoryForm = ({ title, msg, submitCategory, handleSubmit, show, onHide }) => {

    const modalProps = {
        show,
        onHide
    };   

    return (
        <Modal {...modalProps} size="lg" show={show} aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                {title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <Row className="show-grid justify-content-center">
                        <Col>
                            <Form>
                                <Form.Row>
                                    <Field name={'name'} component={InputForm} label={'Category name'} type={'text'} />                                    
                                </Form.Row>                                
                                <Form.Row>
                                    <span style={{ fontSize: '18px' }}>{msg}</span>
                                </Form.Row>
                            </Form>
                        </Col>                            
                    </Row>                        
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button type="submit" onClick={handleSubmit(submitCategory)}>Save</Button>
                <Button variant="secondary" onClick={onHide}>Cancel</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default reduxForm({ form: 'CategoryForm', enableReinitialize: true, validate })(CategoryForm);