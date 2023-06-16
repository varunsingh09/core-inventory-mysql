import React from 'react';
import { Button, Container, Modal, Row } from 'react-bootstrap';

const DeleteConfirmation = ({ title, msg, confirmation, show, onHide }) => {

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
                        <span style={{ fontSize: '20px'}}>{msg}</span>
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button type="submit" onClick={() => confirmation(true)}>Confirm</Button>
                <Button variant="secondary" onClick={onHide}>Cancel</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteConfirmation;