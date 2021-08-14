import React, { Component } from 'react';
import {
  Button,
  WhiteSpace,
  WingBlank,
  Modal,
  Card,
  List,
  Picker,
  Stepper,
} from '@ant-design/react-native';
import NotificationSounds, { playSampleSound, stopSampleSound } from 'react-native-notification-sounds';
import { View, Text, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { logout, checkMe } from '../stores/modules/auth';
import { setRingtone } from '../stores/modules/network';
import Ws from '../Tools/@adonisjs/websocket-client';
import moment from 'moment';
let ws = {};
let wsInstance = {};
var intervalObject = null;

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginError: false,
      loginErrorDetails: '',
      devices: [],
      userDetails: null,
      selectedRingtone: 0,
      ringtoneList: [],
      start: false,
      startTick: null,
      alertAfter: 15,
    };
  }

  componentDidMount() {
    //get ringtones

    NotificationSounds.getNotifications('notification').then(soundsList => {
      this.setState(state => {
        let { ringtoneList, selectedRingtone } = state
        let b = []
        soundsList.map((entry, index) => {
          b.push({ id: index, value: index, label: entry.title })
        })
        ringtoneList = b;
        selectedRingtone = this.props.network ? this.props.network.ringtone_int : 0
        return { ringtoneList, selectedRingtone }
      })
    })


    console.log('HAAA?')
    console.log(this.props);
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
      wsInstance.emit('connected', data);
    });
    wsInstance.on('dataUpdate', data2 => {
      if (data2.devices.length > 0) {
        let c = data2.devices;
        c.map((entry, key) => {
          let b = null;
          if (entry.sensor_reading > 70) {
            let ba = moment(new Date(entry.time_started_high_db));
            let bb = moment(new Date());
            b = bb.diff(ba, 'seconds');
          }
          this.setState(state => {
            let { devices } = state;
            devices[key] = entry
            devices[key].timer_value = b;

            return { devices };
          });
        });
      }
      // this.setState({devices: data2.devices});
    });
    ws.getSubscription('monitor').on('error', data => {
      console.log(data);
    });
  }

  tick() {
    if (this.state.devices.length > 0) {
      let c = this.state.devices;
      c.map((entry, key) => {
        let b = null;
        if (entry.sensor_reading > 70) {
          let ba = moment(new Date(entry.time_started_high_db));
          let bb = moment(new Date());
          b = bb.diff(ba, 'seconds');
        }
        this.setState(state => {
          let { devices } = state;
          devices[key].timer_value = b;

          return { devices };
        });
      });
    }
  }

  componentWillReceiveProps(props) {
    let { auth } = props;

    if (auth.loginError) {
      this.setState({ loginError: true, loginErrorDetails: auth.loginError });
    }
  }

  componentWillUnmount() {
    clearTimeout(intervalObject);
  }

  pad(num) {
    return ('0' + num).slice(-2);
  }

  onChangRingtone(value) {
    console.log(value[0])
    NotificationSounds.getNotifications('notification').then(soundsList => {
      playSampleSound(soundsList[value[0]])
    })
    this.setState({ selectedRingtone: value[0] })
    this.props.setRingtone(value[0])
  }

  hhmmss(secs) {
    if (secs > (this.state.alertAfter * 60) && this.state.start) {
      NotificationSounds.getNotifications('notification').then(soundsList => {
        playSampleSound(soundsList[this.state.selectedRingtone]);
      })

    } else {
      stopSampleSound();
    }

    var minutes = Math.floor(secs / 60);
    secs = secs % 60;
    var hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(secs)}`;
    // return pad(hours)+":"+pad(minutes)+":"+pad(secs); for old browsers
  }

  toggle() {
    this.setState(state => {
      let { start, startTick } = state

      if (!start) {

        startTick = setInterval(
          () => {
            this.tick();
          },
          1000,
          null,
        );
      } else {
        clearInterval(startTick)
      }

      return { start: !start, startTick }
    })
  }

  render() {
    return (
      <View>
        <Modal
          visible={this.state.loginError}
          onClose={() => this.props.logout()}>
          <Text>
            Session Error / Expired. Tap Anywhere to return to Login Screen.
          </Text>
          <Text>Details: {this.state.loginErrorDetails}</Text>
        </Modal>
        <Card>
          <Text>
            User: {this.state.userDetails && this.state.userDetails.username}
          </Text>
          <Text>
            Assigned Barangay :{' '}
            {this.state.userDetails && this.state.userDetails.barangay.name}
          </Text>
          <List.Item>
            <Picker onChange={(value) => this.onChangRingtone(value)} value={this.state.selectedRingtone} data={this.state.ringtoneList} cols={1}><Text>Selected Ringtone - {this.state.selectedRingtone && this.state.ringtoneList.length > 0 && this.state.ringtoneList[this.state.selectedRingtone].label}</Text></Picker>
          </List.Item>
          <List.Item>
            <Text>Alert after how many minutes?</Text>
          </List.Item>
          <List.Item>
            <Stepper key="1" min="1" defaultValue={1} onChange={(value) => this.setState(state => {
              let { alertAfter } = state
              alertAfter = value

              return { alertAfter }
            })}>
            </Stepper>
          </List.Item>
          <Button onPress={() => this.toggle()}>{!this.state.start && ("Start Monitoring")} {this.state.start && ("Stop Monitoring")}</Button>
        </Card>
        <WhiteSpace size="lg" />
        {this.state.devices &&
          this.state.devices.map(entry => {
            let bgcolor = '#FFF';
            if (entry.sensor_reading > 70 && entry.sensor_reading < 100) {
              bgcolor = '#f9d342';
            } else if (entry.sensor_reading > 100) {
              bgcolor = '#F00';
            } else {
              bgcolor = '#FFF';
            }
            var a = moment(new Date(entry.time_started_high_db));
            var b = moment(new Date());
            return (
              <Card style={{ backgroundColor: bgcolor }}>
                <Card.Header title={entry.sensor_name} />
                <Card.Body>
                  <Text>Readings: {entry.sensor_reading}db</Text>
                  {entry.sensor_reading > 70 && (
                    <Text>
                      Time Since above 70db :{this.hhmmss(entry.timer_value)}
                    </Text>
                  )}
                </Card.Body>
              </Card>
            );
          })}
        <Button
          onPress={() => {
            if (ws != null) {
              ws.close();
            }
            this.props.logout();
          }}>
          Logout
        </Button>
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
  setRingtone
};

export default connect(
  mapStateToProps,
  mapActionCreators,
)(HomePage);

HomePage.propTypes = {};
