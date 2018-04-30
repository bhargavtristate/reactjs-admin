import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

// Containers
import Full from './containers/Full/'
import Simple from './containers/Simple/'

import Charts from './views/Charts/'
import Dashboard from './views/Dashboard/'
import Buttons from './views/Components/Buttons/'
import Cards from './views/Components/Cards/'
import Forms from './views/Components/Forms/'
import Modals from './views/Components/Modals/'
import SocialButtons from './views/Components/SocialButtons/'
import Switches from './views/Components/Switches/'
import Tables from './views/Components/Tables/'
import Tabs from './views/Components/Tabs/'
import FontAwesome from './views/Icons/FontAwesome/'
import SimpleLineIcons from './views/Icons/SimpleLineIcons/'
import Login from './views/Pages/Login/'
import Categories from './views/Pages/Categories/'
import CategoriesUpdate from './views/Pages/CategoriesUpdate/'
import GlobalSettings from './views/Pages/GlobalSettings/'
import Offers from './views/Pages/Offers/'
import OffersManagement from './views/Pages/OffersManagement/'
import SubCategories from './views/Pages/SubCategories/'
import SubCategoriesManagement from './views/Pages/SubCategoriesManagement/'
import Tasker from './views/Pages/Tasker/'
import TaskerUpdate from './views/Pages/TaskerUpdate/'
import Users from './views/Pages/Users/'
import UserUpdate from './views/Pages/UserUpdate/'
import Tasks from './views/Pages/Tasks/'
import AdminRoles from './views/Pages/AdminRoles/'
import AdminRolesManagement from './views/Pages/AdminRolesManagement/'
import Admins from './views/Pages/Admins/'
import AdminManagement from './views/Pages/AdminManagement/'
import Register from './views/Pages/Register/'
import Page404 from './views/Pages/Page404/'
import Page500 from './views/Pages/Page500/'
import Widgets from './views/Widgets/'

export default (
  <Router history={hashHistory}>
    <Route path="/" name="Home" component={Full}>
      <IndexRoute component={Login}/>
      <Route path="login" name="Login Page" component={Login}/>
      <Route path="dashboard" name="Dashboard" component={Dashboard}/>
      <Route path="categories_management" name="Categories Management" component={Categories}/>
      <Route path="global_settings" name="Global Settings Management" component={GlobalSettings}/>
      <Route path="category_update" name="Categories Management" component={CategoriesUpdate}/>
      <Route path="categories_management/" name="Categories">
        <Route path="offers" name="Offers Management" component={Offers}/>
        <Route path="offer_management" name="Offers Management" component={OffersManagement}/>
        <Route path="sub_categories" name="Sub-Categories Management" component={SubCategories}/>
        <Route path="sub_categories_management" name="Sub-Categories Management" component={SubCategoriesManagement}/>
      </Route>
      <Route path="taskers" name="Taskers Management" component={Tasker}/>
      <Route path="tasker_update" name="Taskers Management" component={TaskerUpdate}/>
      <Route path="users" name="Users Management" component={Users}/>
      <Route path="user_update" name="Users Management" component={UserUpdate}/>
      <Route path="tasks" name="Tasks Management" component={Tasks}/>
      <Route path="admin_roles" name="Roles Management" component={AdminRoles}/>
      <Route path="admin_roles_management" name="Roles Management" component={AdminRolesManagement}/>
      <Route path="admin_roles/" name="Roles Management">
        <Route path="admins" name="Admin Management" component={Admins}/>
        <Route path="admin_management" name="Admin Management" component={AdminManagement}/>
      </Route>
      <Route path="components/" name="Components">
        <IndexRoute component={Buttons}/>
        <Route path="buttons" name="Buttons" component={Buttons}/>
        <Route path="cards" name="Cards" component={Cards}/>
        <Route path="forms" name="Forms" component={Forms}/>
        <Route path="modals" name="Modals" component={Modals}/>
        <Route path="social-buttons" name="Social Buttons" component={SocialButtons}/>
        <Route path="switches" name="Swithces" component={Switches}/>
        <Route path="tables" name="Tables" component={Tables}/>
        <Route path="tabs" name="Tabs" component={Tabs}/>
      </Route>
      <Route path="icons/" name="Icons">
        <IndexRoute component={FontAwesome}/>
        <Route path="font-awesome" name="Font Awesome" component={FontAwesome}/>
        <Route path="simple-line-icons" name="Simple Line Icons" component={SimpleLineIcons}/>
      </Route>
      <Route path="widgets" name="Widgets" component={Widgets}/>
      <Route path="charts" name="Charts" component={Charts}/>
    </Route>
    <Route path="pages/" name="Pages" component={Simple}>
      <IndexRoute component={Login}/>
      <Route path="login" name="Login Page" component={Login}/>
      <Route path="register" name="Register Page" component={Register}/>
      <Route path="404" name="Page 404" component={Page404}/>
      <Route path="500" name="Page 500" component={Page500}/>
    </Route>
  </Router>
);
