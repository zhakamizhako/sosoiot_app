// In App.js in a new project

import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
// import Switch from '@react-navigation/switch';
import LoginScreen from './LoginScreen';

import HomePage from './HomePage';

import AdminPage from './AdminPage';

import UserManagementPage from './AdminPage/UserManagement';
import UserList from './AdminPage/UserManagement/Users';
import ViewUser from './AdminPage/UserManagement/ViewUser';
import CreateUser from './AdminPage/UserManagement/CreateUser';

import BarangayManagementPage from './AdminPage/BarangayManagement';
import BarangayList from './AdminPage/BarangayManagement/Barangays';
import CreateBarangay from './AdminPage/BarangayManagement/CreateBarangay';
import ViewBarangay from './AdminPage/BarangayManagement/ViewBarangay';
import Simulation from './AdminPage/Simulation';
import NetworkOptions from './NetworkOptions';

import {connect} from 'react-redux';

const Stack = createStackNavigator();

class Navigator extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="login">
          {this.props.auth.loginData && this.props.auth.loginData.role === 999 && (
            <>
              <Stack.Screen
                name="admin"
                component={AdminPage}
                options={{
                  title: 'Administrative Management',
                  headerShown: true,
                }}
              />
              <Stack.Screen
                name="usermanagement"
                component={UserManagementPage}
                options={{
                  title: 'User Management',
                  headerShown: true,
                }}
              />
              <Stack.Screen
                name="userlist"
                component={UserList}
                options={{
                  title: 'User List',
                  headerShown: true,
                }}
              />
              <Stack.Screen
                name="viewuser"
                component={ViewUser}
                options={{
                  title: 'User Details',
                  headerShown: true,
                }}
              />
              <Stack.Screen
                name="createuser"
                component={CreateUser}
                options={{
                  title: 'User Registration',
                  headerShown: true,
                }}
              />
              <Stack.Screen
                name="barangaymanagement"
                component={BarangayManagementPage}
                options={{
                  title: 'Baranggay Management',
                  headerShown: true,
                }}
              />
              <Stack.Screen
                name="barangaylist"
                component={BarangayList}
                options={{
                  title: 'List of Barangays',
                  headerShown: true,
                }}
              />
              <Stack.Screen
                name="viewbarangay"
                component={ViewBarangay}
                options={{
                  title: 'View Barangay',
                  headerShown: true,
                }}
              />
              <Stack.Screen
                name="createbarangay"
                component={CreateBarangay}
                options={{
                  title: 'Create / Edit Barangay',
                  headerShown: true,
                }}
              />
              <Stack.Screen
                name="simulation"
                component={Simulation}
                options={{
                  title: 'Simulation',
                  headerShown: true,
                }}
              />
            </>
          )}
          {this.props.auth.loginData &&
            this.props.auth.loginData.role === 1 && (
              <Stack.Screen
                name="homepage"
                component={HomePage}
                options={{title: 'Overview', headerShown: true}}
              />
            )}
          {!this.props.auth.loginData && (
            <Stack.Screen
              {...this.props}
              name="login"
              component={LoginScreen}
              options={{title: 'Login Screen', headerShown: false}}
            />
          )}
          <Stack.Screen
            name="networkoptions"
            component={NetworkOptions}
            options={{title: 'Network Options', headerShown: true}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});

const mapActionCreators = {};

export default connect(
  mapStateToProps,
  mapActionCreators,
)(Navigator);
