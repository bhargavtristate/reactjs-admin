import React, { Component } from 'react';
import { Dropdown, DropdownMenu, DropdownItem } from 'reactstrap';
import commonMethods from '../../common';
import { Router, Route, IndexRoute, hashHistory , Link } from 'react-router';

class Header extends Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false
    };
  }

  toggle(e) {
    e.preventDefault();
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  sidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-hidden');
  }

  sidebarMinimize(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-compact');
  }

  mobileSidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-mobile-show');
  }

  asideToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('aside-menu-hidden');
  }
  logoutUser(){
    //alert("Hello");
    commonMethods.logout();
    hashHistory.push('/pages/login');
  }
  render() {
    return (
      <header className="app-header navbar">
        <button className="navbar-toggler mobile-sidebar-toggler d-lg-none" onClick={this.mobileSidebarToggle} type="button">&#9776;</button>
        <a className="navbar-brand" href="#"></a>
        <ul className="nav navbar-nav d-md-down-none">
          <li className="nav-item">
            <a className="nav-link navbar-toggler sidebar-toggler" onClick={this.sidebarToggle} href="#">&#9776;</a>
          </li>
          {/*<li className="nav-item px-3">
            <a className="nav-link" href="#">Dashboard</a>
          </li>
          <li className="nav-item px-3">
            <a className="nav-link" href="#">Users</a>
          </li>
          <li className="nav-item px-3">
            <a className="nav-link" href="#">Settings</a>
          </li>*/}
        </ul>
        <ul className="nav navbar-nav ml-auto mr-3">
          {/*<li className="nav-item d-md-down-none">
            <a className="nav-link" href="#"><i className="icon-bell"></i><span className="badge badge-pill badge-danger">5</span></a>
          </li>
          <li className="nav-item d-md-down-none">
            <a className="nav-link" href="#"><i className="icon-list"></i></a>
          </li>
          <li className="nav-item d-md-down-none">
            <a className="nav-link" href="#"><i className="icon-location-pin"></i></a>
          </li>
          <li className="nav-item">
           
          </li>
          <li className="nav-item d-md-down-none">
            <a className="nav-link navbar-toggler aside-menu-toggler" onClick={this.asideToggle} href="#">&#9776;</a>
          </li>*/}
          <li className="nav-item mr-3">
            <a href="#" onClick={this.logoutUser}><i className="fa fa-sign-out fa-lg"></i> Logout</a>
          </li>
        </ul>
      <div className="page-loader">
        <i className="fa fa-spinner fa-4x mt-4 fa-spin"></i>
      </div>
      </header>
    )
  }
}

export default Header;
