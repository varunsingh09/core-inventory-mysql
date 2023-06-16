import React, { PureComponent } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { reset } from 'redux-form';
import { setPathname, setError } from '../actions/users';
import { getCategories } from '../actions/categories';
import { createItem } from '../actions/items';
import { Alert, Col, Container, Row } from 'react-bootstrap';
import Loader from 'react-loader-spinner';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ItemForm from '../forms/ItemForm';

class CreateItem extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            showAlert: false
        };
        this.props.reset();
    }

    componentDidMount() {   
        const { getCategories, setPathname } = this.props;
        getCategories();
        setPathname('/create-item');
        window.scrollTo(0, 0);        
    }  

    handleShowAlert = () => {
        this.setState({ showAlert: true });
        const hideAlert = () => this.setState({ showAlert: false }); 
        setTimeout(function(){ hideAlert() }, 4000);
    };

    handleSubmitItem = (data) => {   
        const { createItem, setError } = this.props;
        setError(null);
        createItem(data);
        this.handleShowAlert();
    };
    
    render() {
        const { categories, session, loading, error } = this.props;                        

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
                        <Container className="create-edit-item">
                            <Row>
                                <Col className="item-form">
                                    <ItemForm 
                                        title={'Create item'}                                        
                                        initialValues={{ quantity: '0' }}
                                        categories={categories}
                                        fileRequired={true}
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
        categories: state.CategoryReducer.categories,
        session: state.UserReducer.session,
        loading: state.UserReducer.loading,
        error: state.UserReducer.error        
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        createItem: (data) => dispatch(createItem(data)),
        getCategories: () => dispatch(getCategories),        
        setPathname: (pathname) => dispatch(setPathname(pathname)),
        setError: (error) => dispatch(setError(error)),
        reset: () => dispatch(reset('ItemForm'))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateItem);