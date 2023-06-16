import React from 'react';
import { Col, Form } from 'react-bootstrap';

const SelectForm = ({
    meta: { error, touched },
    input: { name, value, onChange, onBlur },
    label, as, noOption, options
}) => {

    return (
        <React.Fragment>
            <Form.Group as={Col} md="12">
                {
                    label &&
                    <Form.Label>
                        {label}
                    </Form.Label>
                }
                <Form.Control
                    isInvalid={error && touched}
                    isValid={!error && touched}
                    name={name} 
                    as={as}
                    value={value}  
                    onChange={onChange}
                    onBlur={onBlur}>
                    <option value={'NULL'}>{noOption}</option>
                    {
                        options &&
                        options.map((option) => {
                            return <option key={option.id} value={option.id}>{option.name}</option>
                        })
                    }
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                    {error}
                </Form.Control.Feedback>
            </Form.Group>
        </React.Fragment>
    );
};

export default SelectForm;