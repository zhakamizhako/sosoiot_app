import React, {Component} from 'react';
import {
  WhiteSpace,
  WingBlank,
  InputItem,
  Button,
  Checkbox,
} from '@ant-design/react-native';
import {View, Text, ScrollView, Icon} from 'react-native';
import {login} from '../stores/modules/auth';
import {connect} from 'react-redux';

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      showPassword: false,
      isLoggingIn: false,
      loginError: false,
      loginErrorDetails: '',
      connectionError: false,
    };
  }

  componentDidMount() {
    // console.log(this.props.auth);
    // ws = Ws(`ws://${this.state.auth}`)
  }

  componentWillReceiveProps(props) {
    let {auth} = props;
    if (auth.connectionError) {
      this.setState({
        loginError: true,
        isLoggingIn: false,
        loginErrorDetails: auth.connectionError,
      });
    }
    if (auth.loginError) {
      this.setState({
        loginError: true,
        loginErrorDetails: auth.loginError,
        isLoggingIn: false,
      });
    }
  }

  render() {
    return (
      <View>
        <WhiteSpace size="lg" />
        <WingBlank>
          <Text style={{fontSize: 30, textAlign: 'center'}}>S O S I O T</Text>
          <InputItem
            clear
            error={this.state.loginError}
            onChange={e => {
              if (this.state.loginError) {
                this.setState({loginError: false, loginErrorDetails: ''});
              }
              this.setState(state => {
                let {username} = state;
                username = e;
                return {username};
              });
            }}
            placeholder="Username"
          />
          <InputItem
            type={!this.state.showPassword ? 'password' : ''}
            clear
            error={this.state.loginError}
            onChange={e => {
              if (this.state.loginError) {
                this.setState({loginError: false, loginErrorDetails: ''});
              }
              this.setState(state => {
                let {password} = state;
                password = e;
                return {password};
              });
            }}
            placeholder="Password"
          />
          <WhiteSpace />
          <Text style={{alignSelf: 'center', color: 'red'}}>
            {this.state.loginErrorDetails}
          </Text>
          <WhiteSpace />
          <Checkbox
            style={{marginLeft: 12}}
            checked={this.state.showPassword}
            onChange={event => {
              this.setState({showPassword: event.target.checked});
            }}>
            Show Password
          </Checkbox>
          <WhiteSpace size="lg" />
          <Button
            type="primary"
            loading={this.state.isLoggingIn}
            onPress={() => {
              let loginData = {
                username: this.state.username,
                password: this.state.password,
              };
              this.setState({isLoggingIn: true});
              this.props.login(loginData);
            }}>
            Login
          </Button>
          <WhiteSpace size="lg" />
          <Button
            onPress={() => this.props.navigation.navigate('networkoptions')}>
            Network Options
          </Button>
        </WingBlank>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});

const mapActionCreators = {
  login,
};

export default connect(
  mapStateToProps,
  mapActionCreators,
)(LoginScreen);

LoginScreen.propTypes = {};

// export default LoginScreen;
