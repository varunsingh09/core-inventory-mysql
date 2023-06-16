import React, { PureComponent } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { reset } from 'redux-form';
import { setPathname, setSuccess, setError } from '../actions/users';
import { getCategories, setCategory, createCategory, updateCategory, deleteCategory } from '../actions/categories';
import { Alert, Badge, Button, Col, Container, Row } from 'react-bootstrap';
import Loader from 'react-loader-spinner';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CategoryForm from '../forms/CategoryForm';
import DeleteConfirmation from '../components/DeleteConfirmation';

class Categories extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            activeEdit: true,
            activeDelete: false,
            showCategoryForm: false,
            showDeleteConfirmation: false,            
            showAlert: false                                        
        };
    }

    componentDidMount() {             
        const { setCategory, getCategories, setPathname } = this.props;        
        setCategory(null);
        getCategories();
        setPathname('/categories');
        window.scrollTo(0, 0);
    }    

    handleEdit = () => {                
        this.setState({ activeEdit: true, activeDelete: false});
        
    };

    handleDelete = () => {                
        this.setState({ activeEdit: false, activeDelete: true});
        
    };

    handleShowCategoryForm = () => {
        const { setCategory, reset } = this.props;
        const current = this.state.showCategoryForm;
        this.setState({ showCategoryForm: !current });
        if (this.state.showCategoryForm) {
            setCategory(null);
            reset();
        } 
    };
    
    handleShowDeleteConfirmation = () => {
        const current = this.state.showDeleteConfirmation;
        this.setState({ showDeleteConfirmation: !current });        
    };

    handleShowAlert = () => {
        this.setState({ showAlert: true });
        const hideAlert = () => this.setState({ showAlert: false }); 
        setTimeout(function(){ hideAlert() }, 4000);
    };

    handleSubmitCategory = (data) => {        
        const { category, createCategory, updateCategory, setSuccess, setError } = this.props;        
        setSuccess(null);
        setError(null);
        category ? updateCategory(category.id, data) : createCategory(data)
        this.handleShowCategoryForm();   
        this.handleShowAlert();
    };    

    handleDeleteCategory = (confirmation) => {        
        const { category, deleteCategory, setCategory, setSuccess, setError, reset } = this.props;
        setSuccess(null);
        setError(null);
        if (category && confirmation) deleteCategory(category.id);
        this.handleShowDeleteConfirmation();
        this.handleShowAlert();
        setCategory(null);
        reset();
    };

    render() {
        const { categories, category, session, loading, success, error, setCategory } = this.props;
        
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
                        <Container className="categories">
                            {
                                categories ? 
                                <React.Fragment>
                                    <Row>
                                        <Col xs={12} className="page-title">
                                            <span>Categories</span>
                                        </Col>                                                                                                                
                                        <Col xs={12} className="options">
                                            <Button 
                                                variant="outline-primary"
                                                onClick={this.handleEdit} 
                                                active={this.state.activeEdit}>
                                                Edit mode
                                            </Button>
                                            <Button 
                                                variant="outline-danger" 
                                                onClick={this.handleDelete} 
                                                active={this.state.activeDelete}>
                                                Delete mode
                                            </Button>
                                        </Col>                            
                                        <Col xs={12} className="add-category">
                                            <Badge onClick={this.handleShowCategoryForm}>Add category</Badge>
                                        </Col>                                                                                               
                                        <Col xs={12} className="categories-list">
                                            {             
                                                /*
                                                    Iterates categories and shows them like a glossary. 

                                                    At first iteration it will add a leading letter and the first
                                                    category whose first character in name matches with it.

                                                    If it's not the first iteration, checks if the 
                                                    first character of previous category name is not the same
                                                    as current's and adds a new leading letter with current category
                                                    name. Otherwise, it simply adds the current category in 
                                                    the current leading letter.
                                                */                                               
                                                categories.map((category, index) => {                                                    
                                                    if (index > 0) {
                                                        if (categories[index-1].name.charAt(0) !== categories[index].name.charAt(0)) {
                                                            return (
                                                                <React.Fragment key={category.id}>
                                                                    <Col className="letter">                                                                                                            
                                                                        <span>{category.name.charAt(0)}</span>                                                                                                                      
                                                                    </Col>
                                                                    {
                                                                        this.state.activeEdit ?
                                                                        <Badge 
                                                                            pill 
                                                                            onClick={() => {
                                                                                setCategory(category);
                                                                                this.handleShowCategoryForm()
                                                                            }}>
                                                                            {category.name}
                                                                        </Badge> :
                                                                        <Badge 
                                                                            pill 
                                                                            onClick={() => {
                                                                                setCategory(category); 
                                                                                this.handleShowDeleteConfirmation()
                                                                            }}>
                                                                            {category.name}
                                                                        </Badge>                                                                                                                             
                                                                    }                                                                                                                                                                            
                                                                </React.Fragment>
                                                            );                                                
                                                        }
                                                        return (                                                                                                  
                                                            <React.Fragment>
                                                                {
                                                                    this.state.activeEdit ?
                                                                    <Badge 
                                                                        key={category.id} 
                                                                        pill 
                                                                        onClick={() => {
                                                                            setCategory(category); 
                                                                            this.handleShowCategoryForm()
                                                                        }}>
                                                                        {category.name}
                                                                    </Badge> :
                                                                    <Badge 
                                                                        key={category.id} 
                                                                        pill 
                                                                        onClick={() => {
                                                                            setCategory(category); 
                                                                            this.handleShowDeleteConfirmation()
                                                                        }}>
                                                                        {category.name}
                                                                    </Badge>                                                                                                                             
                                                                } 
                                                            </React.Fragment>
                                                        );
                                                    }
                                                    return ( 
                                                        <React.Fragment key={category.id}>                                            
                                                            <Col className="letter">
                                                                <span>{category.name.charAt(0)}</span>                                                            
                                                            </Col>                                                
                                                            {
                                                                this.state.activeEdit ?
                                                                <Badge 
                                                                    pill 
                                                                    onClick={() => {
                                                                        setCategory(category); 
                                                                        this.handleShowCategoryForm()
                                                                    }}>
                                                                    {category.name}
                                                                </Badge> :
                                                                <Badge 
                                                                    pill 
                                                                    onClick={() => {
                                                                        setCategory(category); 
                                                                        this.handleShowDeleteConfirmation()
                                                                    }}>
                                                                    {category.name}
                                                                </Badge>                                                                                                                             
                                                            } 
                                                        </React.Fragment>
                                                    );
                                                })
                                            }
                                        </Col>
                                    </Row>
                                </React.Fragment> :                        
                                <Row>
                                    <Col xs={12} className="resource-not-found">
                                        <span>No categories</span>
                                    </Col>
                                    <Col xs={12} className="add-category">
                                        <Badge onClick={this.handleShowCategoryForm}>Add category</Badge>
                                    </Col>
                                </Row>                    
                            }
                            {
                                category ?
                                <CategoryForm 
                                    title={'Edit category'} 
                                    msg={`You are editing category "${category.name}".`} 
                                    initialValues={{ name: category.name }} 
                                    submitCategory={this.handleSubmitCategory} 
                                    show={this.state.showCategoryForm} 
                                    onHide={this.handleShowCategoryForm} 
                                /> :
                                <CategoryForm 
                                    title={'Add category'} 
                                    initialValues={{ name: '' }} 
                                    submitCategory={this.handleSubmitCategory} 
                                    show={this.state.showCategoryForm} 
                                    onHide={this.handleShowCategoryForm} 
                                />
                            }
                            {
                                category &&
                                <DeleteConfirmation 
                                    title={'Delete category'} 
                                    msg={`Delete category "${category.name}"? By doing this, items linked to this category will be uncategorized.`} 
                                    confirmation={this.handleDeleteCategory} 
                                    show={this.state.showDeleteConfirmation} 
                                    onHide={this.handleShowDeleteConfirmation} 
                                />
                            }                                
                            {
                                (error && !success && this.state.showAlert) &&
                                <Col xs={12}>
                                    <Alert variant="danger">
                                        {error.name}                                     
                                    </Alert>
                                </Col>
                            } 
                            {
                                (success && !error && this.state.showAlert) &&
                                <Col xs={12}>
                                    <Alert variant="success">
                                        {success}                                        
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
        category: state.CategoryReducer.category,        
        session: state.UserReducer.session,
        loading: state.UserReducer.loading,
        success: state.UserReducer.success,
        error: state.UserReducer.error               
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        getCategories: () => dispatch(getCategories),
        setCategory: (category) => dispatch(setCategory(category)),
        createCategory: (data) => dispatch(createCategory(data)),
        updateCategory: (id, data) => dispatch(updateCategory(id, data)),
        deleteCategory: (id) => dispatch(deleteCategory(id)),        
        setPathname: (pathname) => dispatch(setPathname(pathname)),   
        setSuccess: (success) => dispatch(setSuccess(success)),
        setError: (error) => dispatch(setError(error)),     
        reset: () => dispatch(reset('CategoryForm'))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Categories);