import React, { PureComponent } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { regex } from '../config/constants';
import { setPathname } from '../actions/users';
import { getCategories } from '../actions/categories';
import { getItem, updateItemQuantity, deleteItem } from '../actions/items';
import { Button, Card, Col, Container, Image, Row } from 'react-bootstrap';
import Loader from 'react-loader-spinner';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DeleteConfirmation from '../components/DeleteConfirmation';

class Item extends PureComponent {

    constructor(props) {
        super(props);              
        this.state = {
            showDeleteConfirmation: false,            
            quantity: null,            
            addDisabled: false,
            subtractsaveDisabled: false        
        };
        this.QuantityInput = React.createRef();
        //  If id param of item page is changed, get item with new id param.
        const { item, getItem, match } = this.props;
        if (!item) {
            getItem(match.params.id);            
        }                
    }

    componentDidMount() {
        const { setPathname, location, getCategories } = this.props;
        getCategories();
        setPathname(`${location.pathname}`);         
        window.scrollTo(0, 0);
    }

    componentDidUpdate() {
        /*
            When item exists, change quantity in state to item quantity.
            If quantity is zero, disable subtract button.
        */
        const { item } = this.props;        
        if (item) {                        
            if (this.state.quantity === null) {              
                if (item.quantity === 0) {
                    this.setState({ subtractDisabled: true });
                }
                this.setState({ quantity: item.quantity });                        
            }
        }
    }

    handleEditItem = () => {
        const { item, history } = this.props;
        history.push(`/edit-item/${item.id}`);
    };

    handleDeleteItem = (confirmation) => {        
        const { item, deleteItem } = this.props;
        if (item && confirmation) deleteItem(item.id);                
    };
    
    handleShowDeleteConfirmation = () => {
        const current = this.state.showDeleteConfirmation;
        this.setState({ showDeleteConfirmation: !current });
    };

    handleOnChangeQuantity = (e) => {                                          
        if (!e.target.value) {            
            this.setState({ quantity: undefined, addDisabled: true, subtractDisabled: true });                       
        } else if(regex.numberInput.test(e.target.value)) {                          
            if (parseInt(e.target.value) === 0){
                this.setState({ addDisabled: false, subtractDisabled: true });                                                                                            
            } else {
                this.setState({ addDisabled: false, subtractDisabled: false });                                                     
            }                    
            this.setState({ quantity: parseInt(e.target.value) });                                           
        } else {            
            this.setState({ addDisabled: true, subtractDisabled: true, saveDisabled: true });                       
        }        
    };

    handleAddQuantity = () => {                  
        const add = parseInt(this.QuantityInput.current.value)+1;        
        this.QuantityInput.current.value = add;
        if (add > 0) {
            this.setState({ subtractDisabled: false });    
        }
        this.setState({ quantity: add });    
    };
    
    handleSubtractQuantity = () => {                                       
        const subtract = parseInt(this.QuantityInput.current.value)-1;
        if (regex.numberInput.test(subtract)) {
            this.QuantityInput.current.value = subtract;
            if (subtract === 0) {
                this.setState({ subtractDisabled: true });    
            }
            this.setState({ quantity: subtract });            
        } else {
            this.setState({ subtractDisabled: true });
        }                               
    };

    handleUpdateQuantity = (id) => {
        this.props.updateItemQuantity(id, this.state.quantity);        
    };    

    handleResetQuantity = (quantity) => {        
        this.QuantityInput.current.value = quantity;
        this.setState({ quantity });
        this.setState({ addDisabled: false, subtractDisabled: false });        
    };

    render() {
        const { item, categories, session, loading } = this.props;        
        
        if (!session) {
            return <Redirect to={{ pathname: '/' }} />
        }

        return (
            <React.Fragment>
                {
                    loading ?
                    <Loader
                        type="ThreeDots"
                        color="#00BFFF"
                        height={100}
                        width={100}                         
                        className="loader"
                    /> :
                    <React.Fragment>
                        <Header />                        
                        {
                            item ?
                            <Container className="item">
                                <Row className="item-detail">
                                    <Col xs={12} className="page-title">
                                        <span>{item.name}</span>
                                    </Col>
                                    <Col xs={12} className="options">
                                        <Row className="justify-content-center">
                                            <Col xs="auto">
                                                <Button variant="info" onClick={this.handleEditItem}>Edit</Button>                                                        
                                            </Col>
                                            <Col xs="auto">
                                                <Button variant="danger" onClick={this.handleShowDeleteConfirmation}>Delete</Button>
                                                <DeleteConfirmation
                                                    title={'Delete item'}
                                                    msg={`Delete item "${item.name}"? You can't undo this action.`}
                                                    confirmation={this.handleDeleteItem}
                                                    show={this.state.showDeleteConfirmation}
                                                    onHide={this.handleShowDeleteConfirmation}
                                                />
                                            </Col>
                                        </Row>
                                    </Col> 
                                    <Col xs={12}>
                                        <Row>
                                            <Col xs={12}>                                                                                         
                                                <Image                                                                                                                
                                                    alt={`${item.name}`}
                                                    src={item.image_url}
                                                    thumbnail
                                                />                                                                                                    
                                            </Col>
                                            <Col xs={12} className="quantity">
                                                <Row className="justify-content-center">
                                                    <Col xs="auto">
                                                        <Button 
                                                            variant="primary" 
                                                            disabled={this.state.addDisabled} 
                                                            onClick={this.handleAddQuantity}>
                                                            +
                                                        </Button>                                                        
                                                    </Col>
                                                    <Col xs="auto">
                                                        {
                                                            this.state.quantity === null ?
                                                            <input 
                                                                type="text" 
                                                                ref={this.QuantityInput} 
                                                                className="form-control" 
                                                                defaultValue={item.quantity} 
                                                                onChange={this.handleOnChangeQuantity}
                                                            /> :
                                                            <input 
                                                                type="text" 
                                                                ref={this.QuantityInput} 
                                                                className="form-control" 
                                                                defaultValue={this.state.quantity} 
                                                                onChange={this.handleOnChangeQuantity} 
                                                            />
                                                        }                                                        
                                                    </Col>
                                                    <Col xs="auto">                                                                                                                
                                                        <Button 
                                                            variant="secondary" 
                                                            disabled={this.state.subtractDisabled} 
                                                            onClick={this.handleSubtractQuantity}>
                                                            -
                                                        </Button>                                                      
                                                    </Col>
                                                </Row>
                                                <Row className="justify-content-center">
                                                    <Col xs="auto">
                                                        {
                                                            /*
                                                                Disables save button when there's no
                                                                quantity or when quantity in state is
                                                                the same as stored item quantity.
                                                            */
                                                            this.state.quantity === null ||
                                                            this.state.quantity === undefined || 
                                                            this.state.quantity === item.quantity ?
                                                            <Button variant="success" disabled>Save</Button> :
                                                            <Button 
                                                                variant="success" 
                                                                onClick={() => this.handleUpdateQuantity(item.id)}>
                                                                Save
                                                            </Button>
                                                        }                                                                                                                
                                                    </Col> 
                                                    <Col xs="auto">
                                                        {
                                                            /*
                                                                Disables reset button when quantity in state is
                                                                the same as stored item quantity.
                                                            */
                                                            this.state.quantity === null || this.state.quantity === item.quantity ?
                                                            <Button variant="dark" disabled>Reset</Button> :
                                                            <Button 
                                                                variant="dark" 
                                                                onClick={() => this.handleResetQuantity(item.quantity)}>
                                                                Reset
                                                            </Button>
                                                        }                                                        
                                                    </Col>                                                   
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col xs={12}>
                                        <Row>
                                            <Col xs={12} className="info">
                                                <Row>
                                                    <Col xs={12} md={6}>
                                                        <Card>
                                                            <Card.Header as="h5">Category</Card.Header>
                                                            <Card.Body>
                                                                    {             
                                                                        item.category_id === null ?
                                                                        <Card.Text>Uncategorized</Card.Text> :
                                                                        categories.map((category, index) => {  
                                                                            if (item.category_id === category.id) {
                                                                                return (
                                                                                    <Card.Text 
                                                                                        key={category.id}>
                                                                                        {category.name}
                                                                                    </Card.Text>
                                                                                );
                                                                            } else {
                                                                                return null;
                                                                            }
                                                                        })
                                                                    }                                                                                                              
                                                            </Card.Body>
                                                        </Card> 
                                                    </Col>
                                                    <Col xs={12} md={6}>
                                                        <Card>
                                                            <Card.Header as="h5">Unit</Card.Header>
                                                            <Card.Body>                                                                                                                
                                                                <Card.Text>{item.unit}</Card.Text>                                                                                                              
                                                            </Card.Body>
                                                        </Card>   
                                                    </Col>
                                                    <Col xs={12} md={6}>
                                                        <Card>
                                                            <Card.Header as="h5">Last modify</Card.Header>
                                                            <Card.Body>                                                                                                                
                                                                <Card.Text>{item.modified}</Card.Text>                                                                                                              
                                                            </Card.Body>
                                                        </Card>   
                                                    </Col>
                                                    <Col xs={12} md={6}>
                                                        <Card>
                                                            <Card.Header as="h5">Creation</Card.Header>
                                                            <Card.Body>                                                                                                                
                                                                <Card.Text>{item.created}</Card.Text>                                                                                                              
                                                            </Card.Body>
                                                        </Card>   
                                                    </Col>                                                    
                                                </Row>                                                                                                                                                     
                                            </Col>                                                                                       
                                        </Row>
                                    </Col>
                                </Row>
                            </Container> : 
                            <Col xs={12} className="resource-not-found">
                                <span>Item not found</span>
                            </Col>
                        }
                        <Footer />
                    </React.Fragment>
                }
            </React.Fragment>            
        );
    }

}

const mapStateToProps = (state, ownProps) => {
    return {
        item: state.ItemReducer.item,
        categories: state.CategoryReducer.categories,
        session: state.UserReducer.session,
        loading: state.UserReducer.loading        
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {        
        getItem: (id) => dispatch(getItem(id)),
        updateItemQuantity: (id, data) => dispatch(updateItemQuantity(id, data)),  
        deleteItem: (id) => dispatch(deleteItem(id)),
        getCategories: () => dispatch(getCategories), 
        setPathname: (pathname) => dispatch(setPathname(pathname))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Item);