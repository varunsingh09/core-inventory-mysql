import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logOut, removeSession } from '../actions/users';
import { Button, Col, Nav, Navbar, Row } from 'react-bootstrap';
import Logo from '../assets/images/core-inventory-logo.svg';

class Header extends PureComponent {   
    
    constructor(props) {  
        super(props);
        this.state = {
            expandedNavbar: false
        };
        this.Navbar = React.createRef();
    }

    componentDidUpdate() {
        window.addEventListener('mousedown', this.handleClickOutsideNavbar);
        window.addEventListener('scroll', this.handleClickOutsideNavbar);
    }

    componentWillUnmount() {
        window.removeEventListener('mousedown', this.handleClickOutsideNavbar);
        window.removeEventListener('scroll', this.handleClickOutsideNavbar);
    }

    // Closes Navbar if user clicks outside of it.
    handleClickOutsideNavbar = e => {
        const { session } = this.props;
        // Checks if user is logged in.
        if (session) {
            if ((e.clientX) >= e.target.clientWidth) return;
            if (!this.Navbar.current.contains(e.target)) this.setState({ expandedNavbar: false });
        }
    };

    handleLogOut = () => {
        const { removeSession, logOut } = this.props;
        removeSession();
        logOut();
    };

    render() {
        const { session } = this.props;
        
        return (            
              <div className="header">                    
                    {
                        session ?
                        <React.Fragment>
                            <Navbar 
                                ref={this.Navbar} 
                                expand="lg" 
                                expanded={this.state.expandedNavbar}
                                onToggle={() => this.setState({ expandedNavbar: !this.state.expandedNavbar })} 
                                fixed="top" 
                                collapseOnSelect>
                                <Link to="/inventory" className="brand">
                                    <img src={Logo} alt="Core Inventory" width="175px" />
                                </Link>
                                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                                <Navbar.Collapse id="basic-navbar-nav">
                                    <Nav className="mr-auto">
                                        <Nav.Link as={Link} to="/inventory" eventKey="0">View inventory</Nav.Link>
                                        <Nav.Link as={Link} to="/categories" eventKey="1">Categories</Nav.Link>
                                        <Nav.Link as={Link} to="/create-item" eventKey="2">Create item</Nav.Link>                    
                                    </Nav>                    
                                    <Button 
                                        variant="outline-primary" 
                                        className="log-out-button" 
                                        onClick={this.handleLogOut}>
                                        Log out
                                    </Button>                    
                                </Navbar.Collapse>
                            </Navbar>
                        </React.Fragment> :
                        <Row className="header-logged-out">            
                            <Col xs={12} className="brand">   
                                <Link to="/" className="brand">
                                    <img src={Logo} alt="Core Inventory" width="200px" />
                                </Link>
                            </Col>  
                        </Row>
                    }                                                               
            </div>             
        );
    }    
}

const mapStateToProps = (state, ownProps) => {
    return {
        session: state.UserReducer.session
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        logOut: () => dispatch(logOut),
        removeSession: () => dispatch(removeSession)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);