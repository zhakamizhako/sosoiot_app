import React, {Component} from 'react';
import {Button, List} from '@ant-design/react-native';
import {View} from 'react-native';
const Item = List.Item;

class ViewUser extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    console.log(this.props);
  }

  componentWillReceiveProps(props) {
    // console.log('::ViewUser--PROPS::');
    // console.log(props);
  }

  renderRoles(id) {
    if (id === 999) {
      return 'Admin';
    }
    if (id === 1) {
      return 'Tanod';
    }

    return null;
  }

  render() {
    return (
      <View>
        <List>
          {this.props.route.params.entry && (
            <>
              <Item>Name: {this.props.route.params.entry.username}</Item>
              <Item>Email: {this.props.route.params.entry.email}</Item>
              <Item>
                Barangay assigned:
                {this.props.route.params.entry.barangay &&
                  this.props.route.params.entry.barangay.name}
              </Item>
              <Item>
                Role:{this.renderRoles(this.props.route.params.entry.role)}
              </Item>
              {/* <Button>Assign Barangay</Button> */}
              <Button
                disabled={this.props.route.params.entry.id === 1}
                onPress={() => {
                  this.props.navigation.navigate('createuser', {
                    entry: this.props.route.params.entry,
                    mode: 'edit',
                  });
                }}>
                Edit User
              </Button>
            </>
          )}
        </List>
      </View>
    );
  }
}

ViewUser.propTypes = {};

export default ViewUser;
