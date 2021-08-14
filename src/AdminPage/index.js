import React, {Component} from 'react';
import {Button, WhiteSpace, WingBlank, Modal} from '@ant-design/react-native';
import {View, Text, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import {logout, checkMe} from '../stores/modules/auth';

class AdminPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginError: false,
      loginErrorDetails: '',
      logoutModal: false,
    };
  }

  componentDidMount() {
    this.props.checkMe(this.props.auth.accessToken);
  }

  componentWillReceiveProps(props) {
    let {auth} = props;

    if (auth.loginError) {
      this.setState({loginError: true, loginErrorDetails: auth.loginError});
    }
  }

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
          <Modal
            visible={this.state.logoutModal}
            // title="Logout Confirmation"
            transparent
            onClose={() => this.setState({logoutModal: false})}
            maskClosable
            // closable
            footer={[
              {
                text: 'Cancel',
                onPress: () => {
                  this.setState({logoutModal: false});
                },
              },
              {
                text: 'OK',
                onPress: () => {
                  this.props.logout();
                  this.setState({logoutModal: false});
                },
              },
            ]}>
            <Text style={{alignSelf: 'center'}}>Sure to Logout?</Text>
          </Modal>
          <WingBlank>
            <Button
              onPress={() => this.props.navigation.navigate('usermanagement')}>
              User Management
            </Button>
            <Button
              onPress={() =>
                this.props.navigation.navigate('barangaymanagement')
              }>
              Barangay Management
            </Button>
            <Button
              onPress={() => this.props.navigation.navigate('simulation')}>
              Simulation
            </Button>
            <Button onPress={() => this.setState({logoutModal: true})}>
              Logout
            </Button>
          </WingBlank>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});

const mapActionCreators = {
  logout,
  checkMe,
};

export default connect(
  mapStateToProps,
  mapActionCreators,
)(AdminPage);

AdminPage.propTypes = {};
