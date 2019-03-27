//require('dotenv').config()

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = process.env.PORT || 4000;

// tp-link
const { login } = require("tplink-cloud-api");
const uuidV4 = require("uuid/v4");
 
const TPLINK_USER = process.env.TPLINK_USER;
const TPLINK_PASS = process.env.TPLINK_PASS;
const TPLINK_TERM = process.env.TPLINK_TERM || uuidV4();

// console.log that server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

// create a GET route
app.get('/api/plugs', async (req, res) => {
    
    var plugList = await getPlugsList();
    
    // activate plug
    if(req.query.action && req.query.alias){
        let plug = plugList.find((plug) => plug.alias === req.query.alias);
        let plugAction = await activatePlug(plug.alias, req.query.action);
        plugList = await getPlugsList();
    };

    // send response
    res.send({ 
        plugs: plugList
    });
});

app.post('/api/plugs/login', (req, res) => {
    res.send({type: 'POST'});
});

// list plugs
async function getPlugsList() {
    // log in to cloud, return a connected tplink object
    const tplink = await login(TPLINK_USER, TPLINK_PASS, TPLINK_TERM);
    //console.log("Current auth token is", tplink.getToken());

    // get a list of raw json objects (must be invoked before .get* works)
    const deviceList = await tplink.getDeviceList();

    // devices = sysInfo of all devices in deviceList
    let devices = [];
    let error = null;
    
    for (let i = 0; i < deviceList.length; i++) {
        var device = deviceList[i];

        let plug = tplink.getHS100(device.alias);
        let deviceInfo = await plug.getSysInfo();
        
        devices.push(deviceInfo);
    }

    return devices;
}

async function activatePlug(alias, action = 'toggle') {
    const tplink = await login(TPLINK_USER, TPLINK_PASS, TPLINK_TERM);
    await tplink.getDeviceList();
    
    let response;
    let plug = tplink.getHS100(alias);


    switch (action) {
        case 'power-on':
        response = await plug.powerOn();
            break;

        case 'power-off':
        response = await plug.powerOff();
            break;

        case 'toggle':
        response = await plug.toggle();
            break;
   
        default:
            break;
    }

    return response;

}