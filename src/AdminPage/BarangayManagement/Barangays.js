import React, {Component} from 'react';
import {
  // Button,
  // WhiteSpace,
  // WingBlank,
  // Modal,
  List,
} from '@ant-design/react-native';
import {View, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import {getBarangays} from '../../stores/modules/barangaymanagement';
const Item = List.Item;

class Barangays extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.getBarangays();
  }

  componentWillReceiveProps(props) {
    // console.log('::Barangays--PROPS::');
    // console.log(props);
    let {barangay} = props;

    if (barangay.getBarangaysData) {
      this.setState({barangay: barangay.getBarangaysData});
    }
  }

  render() {
    return (
      <View>
        <ScrollView>
          <List>
            {this.props.barangay.getBarangaysData &&
              this.props.barangay.getBarangaysData.map(entry => {
                return (
                  <Item
                    key={entry.id}
                    onPress={() =>
                      this.props.navigation.navigate('viewbarangay', {entry})
                    }>
                    {entry.name}
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
  barangay: state.barangay,
});

const mapActionCreators = {
  getBarangays,
};

export default connect(
  mapStateToProps,
  mapActionCreators,
)(Barangays);

Barangays.propTypes = {};
