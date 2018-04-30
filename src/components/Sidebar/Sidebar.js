import React, { Component } from 'react';
import { Link } from 'react-router';
import commonMethods from '../../common'; 

class Sidebar extends Component {
  constructor(props) {
    super(props);
    var admin_data=commonMethods.getAdminInfo();
    console.log("admin_data",admin_data.length);
    //console.log("inside sidebar");
    var show_menu=0;
    if(admin_data && admin_data.role_id.all_access==1)
    {
     show_menu=1; 
    }
    this.state={admin_info:admin_data,show_menu:show_menu};
    if(this.state.admin_info)
    { 
      var permissions=this.state.admin_info.role_id.permissions;
      //console.log("permissions",permissions);
      var that=this.state;
      permissions.map(function(permission) { 
        if(permission.name=='users')
        { console.log("inside users", permission.value);
          that.users=permission.value;
          //that.setState({users: permission.value});
        }
        else if(permission.name=='taskers')
        {
          that.taskers=permission.value;
        }
        else if(permission.name=='tasks')
        {
          that.tasks=permission.value;
        }
        else if(permission.name=='complain_list')
        {
          that.complain_list=permission.value;
        }
        else if(permission.name=='global_settings')
        {
          that.global_settings=permission.value;
        }
        else if(permission.name=='payment_list')
        {
          that.payment_list=permission.value;
        }
        else if(permission.name=='categories_management')
        {
          that.categories_management=permission.value;
        }
      });
      //console.log("states",this.state);
    }
   
  }
  handleClick(e) {
    e.preventDefault();
    e.target.parentElement.classList.toggle('open');
  }

  activeRoute(routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1 ? 'nav-item nav-dropdown open' : 'nav-item nav-dropdown';
  }


  // secondLevelActive(routeName) {
  //   return this.props.location.pathname.indexOf(routeName) > -1 ? "nav nav-second-level collapse in" : "nav nav-second-level collapse";
  // }

  render() {
    return (

      <div className="sidebar">
        <nav className="sidebar-nav">
          <ul className="nav">
            <li className="nav-item">
              <Link to={'/dashboard'} className="nav-link" activeClassName="active"><i className="icon-speedometer"></i> Dashboard <span className="badge badge-info">NEW</span></Link>
            </li>
            { this.state.categories_management==1 &&
              <li className={this.activeRoute("/categories_management")} className={this.activeRoute("/category_update")}>
                <Link to={'/categories_management'} className="nav-link" activeClassName="active"><i className="icon-layers icons font-sm"></i> Categories</Link>
              </li>
            }
            { this.state.global_settings==1 &&
              <li className="nav-item">
                <Link to={'/global_settings'} className="nav-link" activeClassName="active"><i className="fa fa-gears fa-4x"></i>Global Settings</Link>
              </li>
            }
            {/*<li className="nav-item">
              <Link to={'/offers'} className="nav-link" activeClassName="active"><i className="fa fa-gear fa-4x"></i>Offers</Link>
            </li>*/}
            { this.state.taskers==1 &&
              <li className={this.activeRoute("/tasker")}>
                <Link to={'/taskers'} className="nav-link" activeClassName="active"><i className="fa fa-users fa-4x"></i>Taskers</Link>
              </li>
            }
            { this.state.users==1 &&
              <li className={this.activeRoute("/user")}>
                <Link to={'/users'} className="nav-link" activeClassName="active"><i className="fa fa-users fa-4x"></i>Users</Link>
              </li>
            }
            { this.state.tasks==1 &&
              <li className="nav-item">
                <Link to={'/tasks'} className="nav-link" activeClassName="active"><i className="fa fa-tasks fa-4x"></i>Tasks</Link>
              </li>
            }
            {this.state.show_menu==1 && 
            <li className={this.activeRoute("/admin_roles")}>
              <Link to={'/admin_roles'} className="nav-link" activeClassName="active"><i className="fa fa-users fa-4x"></i>Admins & Roles</Link>
            </li>
            }
         {/*  <li className="nav-title">
              UI Elements
            </li>
            <li className={this.activeRoute("/components")}>
              <a className="nav-link nav-dropdown-toggle" href="#" onClick={this.handleClick.bind(this)}><i className="icon-puzzle"></i> Components</a>
              <ul className="nav-dropdown-items">
                <li className="nav-item">
                  <Link to={'/components/buttons'} className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> Buttons</Link>
                </li>
                <li className="nav-item">
                  <Link to={'/components/social-buttons'} className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> Social Buttons</Link>
                </li>
                <li className="nav-item">
                  <Link to={'/components/cards'} className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> Cards</Link>
                </li>
                <li className="nav-item">
                  <Link to={'/components/forms'} className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> Forms</Link>
                </li>
                <li className="nav-item">
                  <Link to={'/components/modals'} className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> Modals</Link>
                </li>
                <li className="nav-item">
                  <Link to={'/components/switches'} className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> Switches</Link>
                </li>
                <li className="nav-item">
                  <Link to={'/components/tables'} className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> Tables</Link>
                </li>
                <li className="nav-item">
                  <Link to={'/components/tabs'} className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> Tabs</Link>
                </li>
              </ul>
            </li>
            <li className={this.activeRoute("/icons")}>
              <a className="nav-link nav-dropdown-toggle" href="#" onClick={this.handleClick.bind(this)}><i className="icon-star"></i> Icons</a>
              <ul className="nav-dropdown-items">
                <li className="nav-item">
                  <Link to={'/icons/font-awesome'} className="nav-link" activeClassName="active"><i className="icon-star"></i> Font Awesome</Link>
                </li>
                <li className="nav-item">
                  <Link to={'/icons/simple-line-icons'} className="nav-link" activeClassName="active"><i className="icon-star"></i> Simple Line Icons</Link>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <Link to={'/widgets'} className="nav-link" activeClassName="active"><i className="icon-calculator"></i> Widgets <span className="badge badge-info">NEW</span></Link>
            </li>
            <li className="nav-item">
              <Link to={'/charts'} className="nav-link" activeClassName="active"><i className="icon-pie-chart"></i> Charts</Link>
            </li>
            <li className="divider"></li>
            <li className="nav-title">
              Extras
            </li>
            <li className="nav-item nav-dropdown">
              <a className="nav-link nav-dropdown-toggle" href="#" onClick={this.handleClick.bind(this)}><i className="icon-star"></i> Pages</a>
              <ul className="nav-dropdown-items">
                <li className="nav-item">
                  <Link to={'/pages/login'} className="nav-link" activeClassName="active"><i className="icon-star"></i> Login</Link>
                </li>
                <li className="nav-item">
                  <Link to={'/pages/register'} className="nav-link" activeClassName="active"><i className="icon-star"></i> Register</Link>
                </li>
                <li className="nav-item">
                  <Link to={'/pages/404'} className="nav-link" activeClassName="active"><i className="icon-star"></i> Error 404</Link>
                </li>
                <li className="nav-item">
                  <Link to={'/pages/500'} className="nav-link" activeClassName="active"><i className="icon-star"></i> Error 500</Link>
                </li>
              </ul>
            </li>*/}
          </ul>
        </nav>
      </div>
    )
  }
}

export default Sidebar;
