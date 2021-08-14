import React, {Component} from 'react';
import {
  Button,
  WhiteSpace,
  WingBlank,
  Modal,
  List,
} from '@ant-design/react-native';
import {View, Text, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import {getUsers, createUser} from '../../stores/modules/usermanagement';
const Item = List.Item;

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.getUsers();
  }

  componentWillReceiveProps(props) {
    console.log('::Users--PROPS::');
    console.log(props);
    let {users} = props;

    if (users.getUsersData) {
      this.setState({users: users.getUsersData});
    }
  }

  render() {
    return (
      <View>
        <ScrollView>
          <List>
            {this.props.users.getUsersData &&
              this.props.users.getUsersData.map(entry => {
                console.log(entry.username);
                return (
                  <Item
                    key={entry.id}
                    onPress={() =>
                      this.props.navigation.navigate('viewuser', {entry})
                    }>
                    {entry.username}
                  </Item>
                );
              })}
          </List>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  users: state.users,
});

const mapActionCreators = {
  getUsers,
  createUser,
};

export default connect(
  mapStateToProps,
  mapActionCreators,
)(Users);

Users.propTypes = {};
