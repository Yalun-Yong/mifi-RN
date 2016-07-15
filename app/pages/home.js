/**
 * Created by lmq on 2016/7/5.
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    SwitchAndroid,
    Text,
    View,
    Image,
    TextInput,
    ToastAndroid,
    TouchableHighlight,
    Navigator,
} from 'react-native';

import {
    carbonStyles,
    Button,
} from 'carbon-native';

const cs = StyleSheet.create(carbonStyles);
var wifiApController = require('../modules/module');
var SettingsView = require('./wifiap-settings.js');
var UserView = require('./user-manager.js');

var PAGE_NAME = {
    SETTING: "settings",
    USER: "usermgt"
}
var RCTDeviceEventEmitter = require('RCTDeviceEventEmitter');

var HomeView = React.createClass({
    getInitialState(){
        this.getState();
        this.getConfig();
        return {
            falseSwitchIsOn: false,
            config: {
                name: "SnailGame",
                passwd: ""
            }
        };
    },
    render: function () {
        return (
            <View style={Styles.container}>
                <Image
                    style={Styles.style_image}
                    source={require('../images/wifi.jpg')}/>
                <View style={Styles.state_container}>
                    <View style={Styles.row_container}>
                        <Text style={[Styles.name,Styles.text_align_right]}>
                            热点名称:
                        </Text>
                        <Text style={[Styles.name,Styles.text_align_left]}>
                            {this.state.config.name}
                        </Text>
                    </View>
                    <View style={Styles.row_container}>
                        <Text style={[Styles.name,Styles.text_align_right]}>热点密码:</Text>
                        <Text style={[Styles.name,Styles.text_align_left]}>
                            {this.state.config.passwd}
                        </Text>
                    </View>
                    <View style={Styles.row_container}>
                        <Text style={[Styles.switch_name,Styles.text_align_right]}>热点状态:</Text>
                        <View style={Styles.switch_container}>
                            <SwitchAndroid
                                onValueChange={(value) =>{
                        if(value){
                            wifiApController.openWifiAp();
                        }else{
                            wifiApController.closeWifiAp();
                        }
                        this.setState({falseSwitchIsOn: value});}
                    }
                                style={Styles.switch}
                                value={this.state.falseSwitchIsOn}/>
                        </View>
                    </View>
                </View>

                <TouchableHighlight onPress={()=>{this._onPress(PAGE_NAME.SETTING)}} style={ Styles.button }
                                    underlayColor={'#66ccff'}>
                    <Text style={Styles.btn_name}>热点设置</Text>
                </TouchableHighlight>
                <TouchableHighlight onPress={()=>{this._onPress(PAGE_NAME.USER)}} style={ Styles.button }
                                    underlayColor={'#66ccff'}>
                    <Text style={Styles.btn_name}>用户管理</Text>
                </TouchableHighlight>
            </View>
        )
    },
    getState: function () {
        wifiApController.getWifiApState((state)=> {
            this.setState({falseSwitchIsOn: state})
        });
    },
    componentDidMount(){
        var that = this;
        this.listener = RCTDeviceEventEmitter.addListener('configChange', function (newConfig) {
            if (!newConfig.newPwd) {
                newConfig.newPwd = "无";
            }
            that.setState({
                config: {
                    name: newConfig.newName,
                    passwd: newConfig.newPwd
                }
            })
        });
        this.wifiApListener = RCTDeviceEventEmitter.addListener('wifiState', function (wifistate) {
            that.setState({falseSwitchIsOn: wifistate.state})
        });
    },
    componentWillUnmount(){
        // 移除 一定要写
        this.listener.remove();
        this.wifiApListener.remove();
    },
    getName: function () {
        wifiApController.getWifiApName(
            (wifiApName)=> {
                this.setState({name: wifiApName});
            }
        )
    },
    getConfig(){
        wifiApController.getWifiApConfig(
            (name, pwd, security)=> {
                if (!pwd) {
                    pwd = "无";
                }
                this.setState({
                        config: {
                            name: name,
                            passwd: pwd,
                        }
                    }
                );
            }
        )
    },
    _onPress(action){
        const {navigator} = this.props;
        if (navigator) {
            if (action == PAGE_NAME.SETTING) {
                navigator.push({
                    name: PAGE_NAME.SETTING,
                    page: SettingsView
                })
            } else if (action == PAGE_NAME.USER) {
                navigator.push({
                    name: PAGE_NAME.USER,
                    page: UserView
                })
            }
        }
    },
});

var Styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F5FCFF',
    },

    state_container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,

    },
    row_container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    name: {
        flex: 1,
        fontSize: 16,
        margin: 10,
    },
    text_align_left: {
        textAlign: 'left',
    },
    text_align_right: {
        textAlign: 'right',
    },
    switch_name: {
        flex: 1,
        fontSize: 16,
        margin: 10,
    },

    switch_container: {
        flex: 1,
        margin: 10,
    },
    switch: {
        alignSelf: 'flex-start',
        marginLeft: 15,
        transform: [
            {scaleX: 1.8},
            {scaleY: 1.8},
        ],
    },
    btn_name: {
        fontSize: 18,
        textAlign: 'center',
        margin: 10,
        color: '#fff'
    },
    style_image: {
        borderRadius: 45,
        height: 70,
        width: 70,
        alignSelf: 'center',
    },
    button: {
        height: 50,
        width: 200,
        margin: 10,
        backgroundColor: '#63B8FF',
        borderColor: '#5bc0de',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
})
module.exports = HomeView;