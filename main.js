"use strict";
const utils =    require(__dirname + '/lib/utils');
const adapter = utils.adapter('samsungTizen');

const webSocket = require('ws');
const wol = require('wake_on_lan');
const req = require('request-promise');

var sendKey = function(key, done) {
      const protocol = adapter.config.protocol;
      const ipAddress = adapter.config.ipAddress;
      const app_name_base64 = (new Buffer("ioBroker")).toString('base64');
      const port = adapter.config.port;
      const token = parseFloat(adapter.config.token);
      let wsUrl;
      if (token === 0) {
      wsUrl = protocol + '://' + ipAddress + ':' + port + '/api/v2/channels/samsung.remote.control?name=' + app_name_base64;  
      }
      if (token > 0) {
      wsUrl = protocol + '://' + ipAddress + ':' + port + '/api/v2/channels/samsung.remote.control?name=' + app_name_base64 + '&token=' + token;
      }
      adapter.log.info('open connection: ' + wsUrl + ', to sendKey: ' + key );
      var ws = new webSocket(wsUrl, {rejectUnauthorized : false}, function(error) {
        done(new Error(error));
      });
      ws.on('error', function (e) {
        done(e);
      });
      ws.on('message', function(data, flags) {
        var cmd =  {"method":"ms.remote.control","params":{"Cmd":"Click","DataOfCmd":key,"Option":"false","TypeOfRemote":"SendRemoteKey"}};
        data = JSON.parse(data);
        if(data.event == "ms.channel.connect") {
          ws.send(JSON.stringify(cmd));
          setTimeout(function() {
            ws.close(); 
          }, 1000);
          done(0);
        }
      });
};

adapter.on('unload', function (callback) {
    try {callback();} catch (e) {callback();}
});

adapter.on('stateChange', function (id, state) {
    adapter.log.info('stateChange: ' + id + ' ' + JSON.stringify(state));
    
    if ( id === adapter.name + '.' + adapter.instance + 'control.power') {
			sendKey('KEY_POWER', function(err) {
                  if (err) {
                      adapter.log.info('Will now try to switch TV with MAC: ' + adapter.config.macAddress + ' on');
                      wol.wake(adapter.config.macAddress, function(error) {
                          if (error) {adapter.log.error('Cannot wake TV with MAC: ' + adapter.config.macAddress + ' error: ' + error )
                          } else {adapter.log.info('WakeOnLAN successfully executed for MAC: ' + adapter.config.macAddress)}
                        });
                  } else {
                        adapter.log.info('sendKey: ' + state.val + ' successfully sent to tv');
                }
              });  
    }
    if ( id === adapter.name + '.' + adapter.instance + 'control.sendKey') {       
        sendKey(state.val, function(err) {
                  if (err) {
                      adapter.log.info('Error in sendKey: ' + state.val + ' error: ' + err);
                  } else {
                        adapter.log.info('sendKey: ' + state.val + ' successfully sent to tv');
                  }
         });    
          
     }
     if ( id !== adapter.name + '.' + adapter.instance + 'control.sendKey' || id !== adapter.name + '.' + adapter.instance + 'control.power') {
        const key = id.split('.')
        adapter.setState('control.sendKey', 'KEY_' + key[3].toUpperCase(), true, function (err) {
            if (err) adapter.log.error(err);
        });  
          
     }
});

adapter.on('ready', function () {
    main();
});

function main() {

    adapter.setObject('control.power', {
        type: 'state',
        common: {
            name: 'on/off',
            type: 'boolean',
            role: 'button'
        },
        native: {}
    });
    adapter.setObject('control.up', {
        type: 'state',
        common: {
            name: 'up',
            type: 'boolean',
            role: 'button'
        },
        native: {}
    });
    adapter.setObject('control.down', {
        type: 'state',
        common: {
            name: 'down',
            type: 'boolean',
            role: 'button'
        },
        native: {}
    });
    adapter.setObject('control.left', {
        type: 'state',
        common: {
            name: 'left',
            type: 'boolean',
            role: 'button'
        },
        native: {}
    });
    adapter.setObject('control.right', {
        type: 'state',
        common: {
            name: 'right',
            type: 'boolean',
            role: 'button'
        },
        native: {}
    });
    adapter.setObject('control.chup', {
        type: 'state',
        common: {
            name: 'channel up',
            type: 'boolean',
            role: 'button'
        },
        native: {}
    });
    adapter.setObject('control.chdown', {
        type: 'state',
        common: {
            name: 'channel down',
            type: 'boolean',
            role: 'button'
        },
        native: {}
    });
    adapter.setObject('control.ch_list', {
        type: 'state',
        common: {
            name: 'channel list',
            type: 'boolean',
            role: 'button'
        },
        native: {}
    });
    adapter.setObject('control.enter', {
        type: 'state',
        common: {
            name: 'enter',
            type: 'boolean',
            role: 'button'
        },
        native: {}
    });
    adapter.setObject('control.return', {
        type: 'state',
        common: {
            name: 'return',
            type: 'boolean',
            role: 'button'
        },
        native: {}
    });
    adapter.setObject('control.menu', {
        type: 'state',
        common: {
            name: 'menu',
            type: 'boolean',
            role: 'button'
        },
        native: {}
    });
    adapter.setObject('control.source', {
        type: 'state',
        common: {
            name: 'source',
            type: 'boolean',
            role: 'button'
        },
        native: {}
    });
    adapter.setObject('control.guide', {
        type: 'state',
        common: {
            name: 'guide',
            type: 'boolean',
            role: 'button'
        },
        native: {}
    });
    adapter.setObject('control.tools', {
        type: 'state',
        common: {
            name: 'tools',
            type: 'boolean',
            role: 'button'
        },
        native: {}
    });
    adapter.setObject('control.info', {
        type: 'state',
        common: {
            name: 'info',
            type: 'boolean',
            role: 'button'
        },
        native: {}
    });
    adapter.setObject('control.red', {
        type: 'state',
        common: {
            name: 'red',
            type: 'boolean',
            role: 'button'
        },
        native: {}
    });
    adapter.setObject('control.blue', {
        type: 'state',
        common: {
            name: 'blue',
            type: 'boolean',
            role: 'button'
        },
        native: {}
    });
    adapter.setObject('control.green', {
        type: 'state',
        common: {
            name: 'green',
            type: 'boolean',
            role: 'button'
        },
        native: {}
    });
    adapter.setObject('control.yellow', {
        type: 'state',
        common: {
            name: 'yellow',
            type: 'boolean',
            role: 'button'
        },
        native: {}
    });
    adapter.setObject('control.volup', {
        type: 'state',
        common: {
            name: 'volume up',
            type: 'boolean',
            role: 'button'
        },
        native: {}
    });
    adapter.setObject('control.voldown', {
        type: 'state',
        common: {
            name: 'volume down',
            type: 'boolean',
            role: 'button'
        },
        native: {}
    });
    adapter.setObject('control.mute', {
        type: 'state',
        common: {
            name: 'volume mute',
            type: 'boolean',
            role: 'button'
        },
        native: {}
    });
    adapter.setObject('control.0', {
        type: 'state',
        common: {
            name: 'key 0',
            type: 'boolean',
            role: 'button'
        },
        native: {}
    });
    adapter.setObject('control.1', {
        type: 'state',
        common: {
            name: 'key 1',
            type: 'boolean',
            role: 'button'
        },
        native: {}
    });
    adapter.setObject('control.2', {
        type: 'state',
        common: {
            name: 'key  2',
            type: 'boolean',
            role: 'button'
        },
        native: {}
    });
    adapter.setObject('control.3', {
        type: 'state',
        common: {
            name: 'key 3',
            type: 'boolean',
            role: 'button'
        },
        native: {}
    });
    adapter.setObject('control.4', {
        type: 'state',
        common: {
            name: 'key 4',
            type: 'boolean',
            role: 'button'
        },
        native: {}
    });
    adapter.setObject('control.5', {
        type: 'state',
        common: {
            name: 'key 5',
            type: 'boolean',
            role: 'button'
        },
        native: {}
    });
    adapter.setObject('control.6', {
        type: 'state',
        common: {
            name: 'key 6',
            type: 'boolean',
            role: 'button'
        },
        native: {}
    });
    adapter.setObject('control.7', {
        type: 'state',
        common: {
            name: 'key 7',
            type: 'boolean',
            role: 'button'
        },
        native: {}
    });
    adapter.setObject('control.8', {
        type: 'state',
        common: {
            name: 'key 8',
            type: 'boolean',
            role: 'button'
        },
        native: {}
    });
    adapter.setObject('control.9', {
        type: 'state',
        common: {
            name: 'key 9',
            type: 'boolean',
            role: 'button'
        },
        native: {}
    });
    adapter.setObject('control.dtv', {
        type: 'state',
        common: {
            name: 'tv source',
            type: 'boolean',
            role: 'button'
        },
        native: {}
    });
    adapter.setObject('control.hdmi', {
        type: 'state',
        common: {
            name: 'hdmi source',
            type: 'boolean',
            role: 'button'
        },
        native: {}
    });
    adapter.setObject('control.contents', {
        type: 'state',
        common: {
            name: 'smart hub',
            type: 'boolean',
            role: 'button'
        },
        native: {}
    });
    adapter.setObject('control.sendKey', {
        type: 'state',
        common: {
            name: 'sendKey',
            type: 'string',
            role: 'state'
        },
        native: {}
    });
	
    adapter.setObject('powerOn', {
        type: 'state',
        common: {
            name: 'power state of TV',
            type: 'boolean',
            role: 'state'
        },
        native: {}
    });    
    
    adapter.subscribeStates('control.*');
	
    const pollingInterval = parseFloat(adapter.config.pollingInterval);
	
    if (pollingInterval > 0) 
    { 
        setInterval(function(){
            let powerState;
            adapter.getState('powerOn', function (err, state) {powerState = state.val;}); 
            req({uri:'http://' + adapter.config.ipAddress + ':' + adapter.config.pollingEndpoint, timeout:10000})
            .then(()=> {
                if(!powerState){
                    adapter.setState('powerOn', true, true, function (err) {
                        if (err) adapter.log.error(err);
                    });
                }
            })
            .catch(error => {       	   
                if(powerState){
                    adapter.setState('powerOn', false, true, function (err) {
                        if (err) adapter.log.error(err);
                    });
                }
            })
	    }, pollingInterval * 1000)
        
    }
    adapter.log.info(adapter.name + '.' + adapter.instance + ' started with config : ' + JSON.stringify(adapter.config));
}
