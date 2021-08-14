import React, {Component} from 'react';
import {Button, WingBlank, InputItem} from '@ant-design/react-native';
import {View} from 'react-native';
import {connect} from 'react-redux';
import {setIP} from '../stores/modules/network';

class NetworkOptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ip: null,
    };
  }

  componentDidMount() {
    if (this.props.network.hostname) {
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({ip: this.props.network.hostname});
    }
  }

  componentWillReceiveProps() {
    if (this.props.network.hostname) {
      this.props.navigation.goBack();
    }
  }

  render() {
    return (
      <View>
        <WingBlank>
          <InputItem
            onChange={e =>
              this.setState(state => {
                console.log(e);
                let {ip} = state;
                ip = e;
                return {ip};
              })
            }
            value={this.state.ip}
            placeholder={'e.g. 192.168.1.1:3333, localhost:3333, etc'}>
            IP Address
          </InputItem>
          <Button
            type="primary"
            onPress={() => this.props.setIP(this.state.ip)}>
            Save Settings
          </Button>
        </WingBlank>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  network: state.network,
});

const mapActionCreators = {
  setIP,
};

export default connect(
  mapStateToProps,
  mapActionCreators,
)(NetworkOptions);

NetworkOptions.propTypes = {};
