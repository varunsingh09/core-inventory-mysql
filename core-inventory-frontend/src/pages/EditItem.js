import React, { PureComponent } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { setPathname, setError } from '../actions/users';
import { getCategories } from '../actions/categories';
import { getItem, updateItem, updateItemImage } from '../actions/items';
import { Alert, Col, Container, Row } from 'react-bootstrap';
import Loader from 'react-loader-spinner';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ItemForm from '../forms/ItemForm';

class EditItem extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            showAlert: false
        }
        //  If id param of edit page is changed, get item with new id param.
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

    handleShowAlert = () => {
        this.setState({ showAlert: true });
        const hideAlert = () => this.setState({ showAlert: false }); 
        setTimeout(function(){ hideAlert() }, 4000);
    };

    handleSubmitItem = (data) => {                                                  
        const { item, updateItem, updateItemImage, setError } = this.props;
        setError(null);
        if (data.categoryId === 'NULL' || isNaN(data.categoryId)) data.categoryId = null;
        /* 
            If stored item name and category are equal to item form name and category then add
            a new attribute indicating it.
        */        
        if (item.name === data.name && item.category_id === data.categoryId) data.nameIsEquals = true;
        if (data.file !== 'NULL') {                        
            updateItemImage(item.id, data.file);
        }
        updateItem(item.id, data);
        this.handleShowAlert();       
    };
    
    render() {
        const { item, categories, session, loading, error } = this.props;

        if (!session)
            return <Redirect to={{ pathname: '/' }} />

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
                            <Container className="create-edit-item">
                                <Row>
                                    <Col className="item-form">                                    
                                        <ItemForm 
                                            title={'Edit item'}
                                            msg={`You are editing the item "${item.name}"`}                                        
                                            initialValues={{
                                                name: item.name,
                                                quantity: String(item.quantity),
                                                unit: item.unit,
                                                categoryId: item.category_id,   
                                                file: 'NULL'
                                            }}
                                            item={item}
                                            categories={categories}
                                            fileRequired={false}                                                                          
                                            submitItem={this.handleSubmitItem}
                                        />
                                    </Col>
                                </Row>
                                {
                                    (error && this.state.showAlert) &&
                                    <Col xs={12}>
                                        <Alert variant="danger">
                                            { error.name || error.file }                                     
                                        </Alert>
                                    </Col>
                                }
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
        loading: state.UserReducer.loading,
        error: state.UserReducer.error
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        getItem: (id) => dispatch(getItem(id)),
        updateItem: (id, data) => dispatch(updateItem(id, data)),
        updateItemImage: (id, data) => dispatch(updateItemImage(id, data)),
        getCategories: () => dispatch(getCategories),
        setPathname: (pathname) => dispatch(setPathname(pathname)),
        setError: (error) => dispatch(setError(error))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditItem);