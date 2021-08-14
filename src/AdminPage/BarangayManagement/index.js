import React, {Component} from 'react';
import {Button, WingBlank, Modal} from '@ant-design/react-native';
import {View, Text, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import {logout, checkMe} from '../../stores/modules/auth';

class BarangayManagement extends Component {
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
          <WingBlank>
            <Button
              onPress={() => this.props.navigation.navigate('barangaylist')}>
              List Baranggays
            </Button>
            <Button
              onPress={() => this.props.navigation.navigate('createbarangay')}>
              Add new Baranggay
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
)(BarangayManagement);

BarangayManagement.propTypes = {};
