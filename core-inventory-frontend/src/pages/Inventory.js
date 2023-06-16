import React, { PureComponent } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { setPathname } from '../actions/users';
import { setItem, getItems, searchItem } from '../actions/items';
import { Button, ButtonGroup, Col, Container, FormControl, InputGroup, Row} from 'react-bootstrap';
import Loader from 'react-loader-spinner';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CategoriesModal from '../views/modals/CategoriesModal';

class Inventory extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            showCategoriesModal: false,
            title: 'All items'            
        };
    }
        
    componentDidMount() {
        const { getItems, setPathname } = this.props;
        getItems('showBy=unfiltered');                
        setPathname('/inventory');
        window.scrollTo(0, 0);          
    }        

    handleCategoriesModal = () => {
        const current = this.state.showCategoriesModal;
        this.setState({ showCategoriesModal: !current });
    };

    handleTitle = (title) => {                          
        this.setState({ title });                     
    }; 

    handleClickItem = (item) => {
        const { setItem, setPathname } = this.props;
        setItem(item);
        setPathname(`/items/${item.id}`);        
    };

    render() {
        const { items, category, session, loading, getItems, searchItem } = this.props;
        if (!session) 
            return <Redirect to={{ pathname: "/" }} />        

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
                        <Container className="inventory">
                            <div className="d-flex flex-column category-bar">
                                <ButtonGroup className="mt-3">
                                    <Button 
                                        variant="primary" 
                                        onClick={this.handleCategoriesModal}>
                                        Show by category
                                    </Button>
                                    <Button 
                                        variant="primary" 
                                        onClick={() => { 
                                            getItems('showBy=uncategorized'); 
                                            this.handleTitle('Uncategorized items') 
                                        }}>
                                        Show by uncategorized
                                    </Button>
                                    <Button 
                                        variant="primary" 
                                        onClick={() => { 
                                            getItems('showBy=unfiltered'); 
                                            this.handleTitle('All items') 
                                        }}>
                                        Show all
                                    </Button>
                                </ButtonGroup>
                            </div>
                            <CategoriesModal 
                                show={this.state.showCategoriesModal} 
                                onHide={this.handleCategoriesModal} 
                                onCategoryName={this.handleTitle}
                            />                                    
                            <Row>
                                <Col className="page-title">                                                      
                                    <span>{this.state.title}</span>
                                </Col>                        
                            </Row>
                            <div className="search-bar">
                                <InputGroup className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="inputGroup-sizing-default">Search</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    {
                                        /*
                                            Shows a search bar that looks for an item
                                            on a category already selected. If there's no
                                            category selected, looks in 'Uncategorized' or
                                            'All items'. Default is 'All items'.
                                        */
                                        category && 
                                        (this.state.title !== 'Uncategorized items' && this.state.title !== 'All items') ?
                                        <FormControl 
                                            onChange={(event) => searchItem(category.id, event)}
                                            aria-label="Default" 
                                            aria-describedby="inputGroup-sizing-default" /> :
                                        <FormControl 
                                            onChange={(event) => searchItem(this.state.title, event)} 
                                            aria-label="Default" 
                                            aria-describedby="inputGroup-sizing-default" />
                                    }                            
                                </InputGroup>
                            </div>
                            {
                                items ? 
                                <Row className="items-grid justify-content-center">                                              
                                    {                                                
                                        items.map(item => {
                                            return (                                    
                                                <Col
                                                    xs={12} sm={6} md={4} lg={3} 
                                                    key={item.id} 
                                                    className="item-box-container">
                                                    <Link 
                                                        to={`/items/${item.id}`}
                                                        onClick={() => this.handleClickItem(item)}>
                                                        <Row className="item-box">
                                                            <Col xs={12}>
                                                                <img src={item.image_url} alt={item.name} />                                            
                                                            </Col>
                                                            <Col xs={12}>                                                                
                                                                <p className="name">{item.name}</p>
                                                                <p className="details">{item.quantity} {item.unit}</p>                                                   
                                                            </Col>
                                                        </Row>
                                                    </Link>                                                                                                
                                                </Col>                                                                        
                                            );
                                        })
                                    }
                                </Row> :                         
                                <Col xs={12} className="resource-not-found">
                                    <span>No items</span>
                                </Col>
                            }                    
                        </Container>
                        <Footer />
                    </React.Fragment>
                }                               
            </React.Fragment>
        );
    }    
}

const mapStateToProps = (state, ownProps) => {
    return {
        items: state.ItemReducer.items,
        category: state.CategoryReducer.category,        
        session: state.UserReducer.session,
        loading: state.UserReducer.loading
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {           
        setItem: (item) => dispatch(setItem(item)),
        getItems: (filter) => dispatch(getItems(filter)),
        searchItem: (filter, event) => dispatch(searchItem(filter, event.target.value)),
        setPathname: (pathname) => dispatch(setPathname(pathname))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Inventory);