import React, {Component} from 'react';
import {Button, InputItem} from '@ant-design/react-native';
import {View, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import {
  createBarangay,
  editBarangay,
  clearBarangayCreation,
  getBarangays,
} from '../../stores/modules/barangaymanagement';

class CreateBarangay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: null,
      isSubmitting: false,
      editMode: false,
      id: null,
    };
  }

  componentDidMount() {
    if (
      this.props.route &&
      this.props.route.params &&
      this.props.route.params.mode &&
      this.props.route.params.mode === 'edit'
    ) {
      let bb = this.props.route.params.entry;
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({editMode: true, id: bb.id, name: bb.name});
    }
  }

  componentWillReceiveProps(props) {
    // console.log('::CreateBarangay--PROPS::');
    // console.log(props);
    let {barangay} = props;

    if (barangay.createBarangaySuccess || barangay.editBarangaySuccess) {
      this.setState({isSubmitting: false});
      if (this.state.editMode) {
        this.props.navigation.pop();
        this.props.navigation.navigate('barangaylist');
      } else {
        this.props.navigation.goBack();
      }

      this.props.getBarangays();
      this.props.clearBarangayCreation();
    }
  }

  render() {
    return (
      <View>
        <ScrollView>
          <InputItem
            value={this.state.name}
            onChange={e =>
              this.setState(state => {
                let {name} = state;
                name = e;
                return {name};
              })
            }>
            Barangay Name
          </InputItem>
          <Button
            type="primary"
            loading={this.state.isSubmitting}
            onPress={() => {
              let data = {name: this.state.name};
              if (!this.state.editMode) {
                this.props.createBarangay(data);
              } else {
                data.id = this.state.id;
                this.props.editBarangay(data);
              }
            }}>
            Submit
          </Button>
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
  createBarangay,
  editBarangay,
  clearBarangayCreation,
  getBarangays,
};

export default connect(
  mapStateToProps,
  mapActionCreators,
)(CreateBarangay);

CreateBarangay.propTypes = {};
