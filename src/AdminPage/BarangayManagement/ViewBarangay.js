import React, {Component} from 'react';
import {Button, List} from '@ant-design/react-native';
import {View} from 'react-native';
const Item = List.Item;

class ViewBarangay extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentWillReceiveProps(props) {}

  render() {
    return (
      <View>
        <List>
          {this.props.route.params.entry && (
            <>
              <Item>Name: {this.props.route.params.entry.name}</Item>
              <Button
                onPress={() => {
                  console.log(this.props.route.params.entry);
                  this.props.navigation.navigate('createbarangay', {
                    entry: this.props.route.params.entry,
                    mode: 'edit',
                  });
                }}>
                Edit Barangay
              </Button>
            </>
          )}
        </List>
      </View>
    );
  }
}

ViewBarangay.propTypes = {};

export default ViewBarangay;
