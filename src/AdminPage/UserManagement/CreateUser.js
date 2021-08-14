/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  Button,
  WhiteSpace,
  WingBlank,
  InputItem,
  Picker,
  Checkbox,
  List,
} from '@ant-design/react-native';
import {View, Text, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import {
  createUser,
  clearUserCreation,
  editUser,
  getUsers,
} from '../../stores/modules/usermanagement';
import {getBarangays} from '../../stores/modules/barangaymanagement';

class CreateUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      password: null,
      email: null,
      barangay: null,
      showPassword: false,
      barangays: [],
      selectedBarangay: null,
      role: 1,
      isSending: false,
      errorDetails: null,
      editMode: false,
      id: null,
    };
  }

  componentDidMount() {
    this.props.getBarangays();
    if (
      this.props.route &&
      this.props.route.params &&
      this.props.route.params.mode &&
      this.props.route.params.mode === 'edit'
    ) {
      let bb = this.props.route.params.entry;
      // console.log(bb);
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({
        username: bb.username,
        email: bb.email,
        selectedBarangay: [bb.barangay_id],
        role: [bb.role],
        editMode: true,
        id: bb.id,
      });
      // this.setState({editMode: true, id: bb.id, name: bb.name});
    }
  }

  componentWillReceiveProps(props) {
    let {barangay, users} = props;
    if (users.createUserSuccess || users.editUserSuccess) {
      this.setState({isSending: false});
      this.props.clearUserCreation();
      if (this.state.editMode) {
        this.props.getUsers();
        this.props.navigation.pop();
        this.props.navigation.navigate('userlist');
      } else {
        this.props.navigation.goBack();
      }
    }
    if (users.createUserError) {
      this.setState({
        isSending: false,
        errorDetails: users.createUserError.error.message,
      });
    }
    if (barangay.getBarangaysData) {
      let data = [];
      console.log('entering');
      barangay.getBarangaysData.map(entry => {
        let g = {
          label: entry.name,
          value: entry.id,
        };
        data.push(g);
        return null;
      });
      this.setState({barangays: data});
    }
  }

  render() {
    return (
      <View>
        <WingBlank>
          <ScrollView>
            <List>
              <InputItem
                value={this.state.username}
                onChange={e =>
                  this.setState(state => {
                    let {username} = state;
                    username = e;
                    return {username};
                  })
                }>
                Username
              </InputItem>
              <InputItem
                // value={this.state.username}
                type={!this.state.showPassword ? 'password' : ''}
                placeholder={this.state.editMode ? '(unchanged)' : ''}
                onChange={e =>
                  this.setState(state => {
                    let {password} = state;
                    password = e;
                    return {password};
                  })
                }>
                Password
              </InputItem>
              <WhiteSpace size="lg" />
              <Checkbox
                style={{marginLeft: 12}}
                checked={this.state.showPassword}
                onChange={event => {
                  this.setState({showPassword: event.target.checked});
                }}>
                Show Password
              </Checkbox>
              <WhiteSpace size="lg" />
              <InputItem
                value={this.state.email}
                onChange={e =>
                  this.setState(state => {
                    let {email} = state;
                    email = e;
                    return {email};
                  })
                }>
                Email
              </InputItem>
              <Picker
                cols={1}
                title="Barangay"
                itemStyle={{marginBottom: 5}}
                data={this.state.barangays}
                onChange={e => this.setState({selectedBarangay: e})}
                value={this.state.selectedBarangay}>
                <List.Item>Select Barangay</List.Item>
              </Picker>
              <Picker
                title="Role"
                cols={1}
                itemStyle={{marginBottom: 5}}
                data={[
                  {value: 1, label: 'Tanod'},
                  {value: 999, label: 'Admin'},
                ]}
                onChange={e => this.setState({role: e})}
                value={this.state.role}>
                <List.Item>Select Role</List.Item>
              </Picker>
              <WhiteSpace size="lg" />
              <Text style={{alignSelf: 'center', color: 'red'}}>
                {this.state.errorDetails}
              </Text>
              <WhiteSpace size="lg" />
              <Button
                type="primary"
                loading={this.state.isSending}
                onPress={() => {
                  console.log('PreSubmit ::::::');
                  let data = {
                    username: this.state.username,
                    password: this.state.password,
                    email: this.state.email,
                    barangay:
                      this.state.selectedBarangay &&
                      this.state.selectedBarangay[0],
                    role: this.state.role && this.state.role[0],
                  };
                  this.setState({isSending: true, errorDetails: null});
                  // console.log(data);
                  if (!this.state.editMode) {
                    this.props.createUser(data);
                  } else {
                    data.id = this.state.id;
                    // console.log(data);
                    this.props.editUser(data);
                  }
                }}>
                {this.state.editMode ? 'Update' : 'Submit'}
              </Button>
            </List>
          </ScrollView>
        </WingBlank>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  users: state.users,
  barangay: state.barangay,
});

const mapActionCreators = {
  createUser,
  getBarangays,
  clearUserCreation,
  editUser,
  getUsers,
};

export default connect(
  mapStateToProps,
  mapActionCreators,
)(CreateUser);

CreateUser.propTypes = {};
