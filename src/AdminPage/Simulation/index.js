import React, { Component } from 'react';
import {
  Button,
  WingBlank,
  Modal,
  InputItem,
  List,
  Picker,
  Slider,
  Checkbox,
} from '@ant-design/react-native';
import { View, Text, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { logout, checkMe } from '../../stores/modules/auth';
import Ws from '../../Tools/@adonisjs/websocket-client';
import RNSoundLevel from 'react-native-sound-level'
let ws = {};
let wsInstance = {};
let intervalA;

class Simulation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginError: false,
      loginErrorDetails: '',
      logoutModal: false,
      barangays: [],
      id: null,
      sensor_name: null,
      level: 0,
      realtime: false,
      selectedBarangay: null,
    };
  }

  componentWillUnmount() {
    RNSoundLevel.stop()
    clearInterval(intervalA);
  }

  componentDidMount() {
    this.props.checkMe(this.props.auth.accessToken);
    let b = this.props.network.hostname;
    let c = b.replace(/http:/gi, 'ws:');
    c = b.replace(/https:/gi, 'ws:');
    console.log(c);

    ws = Ws(c);
    ws.connect();
    wsInstance = ws.subscribe('monitor');
    wsInstance.on('info', data => {
      console.log(data);
      this.setState({ devices: data.devices, userDetails: data.user });
    });
    wsInstance.on('pong', data2 => {
      let data = {
        socketId: data2.socketId,
        userId: this.props.auth.loginData.id,
      };
      wsInstance.emit('connectSimulation', data);
    });
    wsInstance.on('confirmsimulation', data2 => {
      let bb = [];
      if (data2.barangays.length > 0) {
        data2.barangays.map(entry => {
          let g = {
            label: entry.name,
            value: entry.id,
          };
          bb.push(g);
          return null;
        });
      }
      this.setState({ barangays: bb });
    });
    ws.getSubscription('monitor').on('error', data => {
      console.log(data);
    });

    intervalA = setInterval(()=>{
      if(this.state.enabledSoundRecord && this.state.selectedBarangay[0]!=null && this.state.id && this.state.sensor_name){
        console.log("cas")
        this.updateData();
      }
    }, 500)
  }

  enableSoundRecord(){
    RNSoundLevel.start()
    RNSoundLevel.onNewFrame = (data) => {
      // see "Returned data" section below
      this.setState({level:data.value + 140})
    }
    this.setState({enabledSoundRecord:true})
  }

  disableSoundRecord(){
    RNSoundLevel.stop();
    this.setState({enabledSoundRecord : false})
  }

  updateData(value) {
    if (ws != null) {
      let bbb = {
        userId: this.props.auth.loginData.id,
        sensor_name: this.state.sensor_name,
        id: this.state.id,
        sensor_value: value ? value : this.state.level,
        barangay_id: this.state.selectedBarangay[0],
      };
      wsInstance.emit('updateData', bbb);
      console.log(bbb);
    }
  }

  componentWillReceiveProps(props) {
    let { auth } = props;

    if (auth.loginError) {
      this.setState({ loginError: true, loginErrorDetails: auth.loginError });
    }
  }

  handleChange = value => {
    this.setState({ level: value });
    if (this.state.realtime) {
      this.updateData(value);
    }
  };

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
            <List>
              <InputItem
                clear
                type={'number'}
                onChange={val => this.setState({ id: val })}
                placeholder={'e.g. 1'}
                editable={true}
                value={this.state.id}>
                Device ID
              </InputItem>
              <InputItem
                clear
                onChange={val => this.setState({ sensor_name: val })}
                value={this.state.sensor_name}
                editable={true}
                placeholder={'e.g SENSOR_A'}>
                Sensor Name
              </InputItem>
              <Picker
                cols={1}
                title="Barangay"
                itemStyle={{ marginBottom: 5 }}
                data={this.state.barangays}
                onChange={e => this.setState({ selectedBarangay: e })}
                value={this.state.selectedBarangay}>
                <List.Item>Select Barangay</List.Item>
              </Picker>
              <List.Item>
                Sound Level : {this.state.level} db
                <Slider
                  min={0}
                  max={1000}
                  defaultValue={0.25}
                  value={this.state.level}
                  onChange={value => this.handleChange(value)}
                />
              </List.Item>
              <List.Item>
                Update with Slider{' '}
                <Checkbox
                  checked={this.state.realtime}
                  onChange={event => {
                    this.setState({ realtime: event.target.checked });
                    console.log(event.target.checked);
                  }}
                />
              </List.Item>
              
              <List.Item>
                Update with Sound Record{' '}
                <Checkbox
                  checked={this.state.enabledSoundRecord}
                  onChange={(event)=>{
                    if(!this.state.enabledSoundRecord){
                      this.enableSoundRecord()
                    }else{
                      this.disableSoundRecord()
                    }
                  }}
                />
              </List.Item>
              <List.Item>
                <Button onPress={() => this.updateData()}>Update</Button>
              </List.Item>
            </List>
          </WingBlank>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  network: state.network,
});

const mapActionCreators = {
  logout,
  checkMe,
};

export default connect(
  mapStateToProps,
  mapActionCreators,
)(Simulation);

Simulation.propTypes = {};
