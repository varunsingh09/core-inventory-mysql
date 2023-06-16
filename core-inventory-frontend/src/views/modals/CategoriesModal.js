import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { getCategories, getCategory } from '../../actions/categories';
import { getItems } from '../../actions/items';
import { Button, Container, Modal, Row } from 'react-bootstrap';

class CategoriesModal extends PureComponent {

    componentDidMount() {
        this.props.getCategories();                
    }

    render() {
        const { categories, getCategory, getItems, show, onHide, onCategoryName } = this.props;        
        const modalProps = {
            show,
            onHide
        };

        return (
            <Modal {...modalProps} size="lg" show={show} aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                    Categories
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row className="show-grid justify-content-center">
                            {
                                categories ?
                                categories.map((category, index) => {
                                    const filter = `showBy=category&categoryId=${category.id}`;
                                    return (                                        
                                        <Button 
                                            key={category.id} 
                                            onClick={() => {
                                                getCategory(category.id); 
                                                getItems(filter); 
                                                onHide(); 
                                                onCategoryName(`${category.name}`)
                                            }} 
                                            style={{ margin: '10px' }} 
                                            variant="info">
                                            {category.name}
                                        </Button>
                                    );
                                }) :
                                <span style={{ fontSize: '20px' }}>No categories</span>
                            }                            
                        </Row>                        
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        categories: state.CategoryReducer.categories
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        getCategories: () => dispatch(getCategories),
        getCategory: (id) => dispatch(getCategory(id)),
        getItems: (filter) => dispatch(getItems(filter))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CategoriesModal);