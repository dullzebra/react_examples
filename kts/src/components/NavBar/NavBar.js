import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import NavDropdown from 'react-bootstrap/lib/NavDropdown';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import CurrentUser from '_components/User/CurrentUser';
import { path, menu } from '_config/url';
import withPermissions, { isPermsGranted } from '_hoc/withPermissions';
import { connect } from 'react-redux';
import { logout } from '_actions';
import logo from './logo.png';

const actions = { logout };

// Render only allowed NavItems
const Menu = ({ current, permissions }) => {
  return menu.map((item, i) => {
    if (!isPermsGranted(permissions, item.permissionSection)) {
      return;
    }

    return (
      <NavItem key={i} eventKey={i}
        componentClass={Link}
        href={item.link} to={item.link}
        active={current === i}>
        {item.label}
      </NavItem>);
  });
};

const WithPermissionsMenu = withPermissions(Menu);

class NavBar extends React.Component {
  logout = () => {
    const {
      logout,
      history,
    } = this.props;
    logout().then(() => {
      history.push(path.logoutSuccess);
    });
  }

  render() {
    const { value } = this.props;
    return (
      <Navbar fluid inverse collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to='/'><img src={logo} alt='Портал КТС' /></Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <WithPermissionsMenu current={value} />
          </Nav>

          <Nav pullRight>
            <NavDropdown id='logout' title={<CurrentUser />} pullRight>
              <MenuItem onClick={this.logout}>Выйти</MenuItem>
            </NavDropdown>
          </Nav>

        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default withRouter(connect(null, actions)(NavBar));
