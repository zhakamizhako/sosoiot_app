import React, {Component} from 'react';
import {Button, WingBlank, Modal} from '@ant-design/react-native';
import {View, Text, ScrollView} from 'react-native';
import {connect} from 'react-redux';
// import {getUsers, createUser} from '../../stores/modules/usermanagement';

class UserManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginError: false,
      loginErrorDetails: '',
      logoutModal: false,
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(props) {}

  render() {
    return (
      <View>
        <ScrollView>
          <Modal
            visible={this.state.loginError}
            onClose={() => this.props.logout()}>
            <Text>
              Session Error / Expired. Tap Anywhere to return to Login Screen.
            </Text>
            <Text>Details: {this.state.loginErrorDetails}</Text>
          </Modal>
          <WingBlank>
            <Button onPress={() => this.props.navigation.navigate('userlist')}>
              View Users
            </Button>
            <Button
              onPress={() => this.props.navigation.navigate('createuser')}>
              Register new User
            </Button>
          </WingBlank>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  users: state.users,
});

const mapActionCreators = {};

export default connect(
  mapStateToProps,
  mapActionCreators,
)(UserManagement);

UserManagement.propTypes = {};
