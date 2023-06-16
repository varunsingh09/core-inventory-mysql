import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { regex } from '../config/constants';
import { Button, Col, Form, Image, Row, Spinner } from 'react-bootstrap';
import InputForm from '../components/InputForm';
import SelectForm from '../components/SelectForm';

class ItemForm extends PureComponent {       

    render() {
        const { title, msg, fileRequired, item, categories, submitItem, handleSubmit, submitting } = this.props;

        return (            
            <React.Fragment>
                <Row>                                
                    <Col xs={12} className="form">
                        <Form>
                            <Form.Text className="form-title">{title}</Form.Text>                                                            
                            <Form.Row>                                                                                                                       
                                <Field name={'name'} component={InputForm} label={'Name'} type={'text'} />                                                                                                                                                                                              
                            </Form.Row>                                                                   
                            <Form.Row>
                                <Field name={'quantity'} component={InputForm} label={'Quantity'} type={'text'} />
                            </Form.Row>  
                            <Form.Row>
                                <Field name={'unit'} component={InputForm} label={'Unit (e.g. unit(s), pair(s))'} type={'text'} />
                            </Form.Row>
                            <Form.Row>
                                <Field 
                                    name={'categoryId'} 
                                    component={SelectForm} 
                                    label={'Category'} 
                                    as={'select'} 
                                    noOption={'Uncategorized'} 
                                    options={categories} />
                            </Form.Row>
                            <Form.Row>                            
                                {
                                    item ?
                                    <React.Fragment>
                                        <div className="image-container">
                                            <label className="form-label">Image</label>
                                            <Image
                                                alt={`${item.name}`}
                                                src={item.image_url}
                                                thumbnail
                                            />
                                        </div>
                                        <Field name={'file'} fileRequired={fileRequired} component={InputForm} type={'file'} />
                                    </React.Fragment> :
                                    <Field name={'file'} fileRequired={fileRequired} component={InputForm} label={'Image'} type={'file'} />
                                }
                            </Form.Row>                        
                            {
                                msg &&
                                <Form.Text className="form-paragraph">{msg}</Form.Text>
                            }                        
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
                                <Button type="submit" onClick={handleSubmit(submitItem)}>Save</Button>
                            }                                               
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
        errors.name = 'Item name is required';
    }

    if (!values.quantity) {
        errors.quantity = 'Item quantity is required';
    } else if (!regex.numberInput.test(values.quantity)) {
        errors.quantity = 'Invalid item quantity';
    }

    if (!values.unit || values.unit.trim().length === 0) {
        errors.unit = 'Item unit is required';
    }     

    if (!values.file) {
        errors.file = 'Item image is required';
    } else if (values.file !== 'NULL') {
        let type = '';
        switch (values.file.header) {
            case '89504e47':
                type = 'image/png';  
                break;
            case '47494638':
                type = 'image/gif';
                break;
            case 'ffd8ffe0':
            case 'ffd8ffe1':
            case 'ffd8ffe2':
            case 'ffd8ffe3':
            case 'ffd8ffe8':
                type = 'image/jpeg';                               
                break;
            default:
                type = 'unknown';                
                break;
        }        
        if (type === 'unknown') {
            errors.file = 'Invalid image extension';
        }
    }

    return errors;
};

ItemForm = connect(mapStateToProps)(ItemForm);

export default reduxForm({ form: 'ItemForm', validate })(ItemForm);