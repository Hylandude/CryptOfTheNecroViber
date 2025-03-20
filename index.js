const Buttplug = require("buttplug");
const fs = require("fs");
const { type } = require("os");
const address = "ws://127.0.0.1";
const port = "6969";
const logAddress = "C:/Program Files (x86)/Steam/steamapps/common/Crypt of the NecroDancer/Necrodancer64/Necrodancer.log";

const wait = async function(duration){
    await new Promise(r => setTimeout(r, duration));
}

const vibrateDevice = async function(device, strength, duration){
    strength = strength > 1 ? 1 : strength; //cap strength at 1;
    await device.vibrate(strength);
    await wait(duration);
    await device.stop();
}

const vibrateConfirmConnect = async function(device){
    await vibrateDevice(device, 0.1, 100);
    await wait(150);
    await vibrateDevice(device, 0.2, 200);
    await wait(150);
    await vibrateDevice(device, 0.3, 300);
}

var readbytes = 0;
var bite_size = 256;
var fdGlobal;
var deviceGlobal;

const readLogs = async function() {
    let stats = fs.fstatSync(fdGlobal);
    if(stats.size<readbytes+1) {
        setTimeout(readLogs, 100)
    }
    else {
        fs.read(fdGlobal, new Buffer.alloc(bite_size), 0, bite_size, readbytes, processLine);
    }
}

const processLine = async function(err, bytecount, buff) {
    latestLine = buff.toString('utf-8', 0, bytecount);
    readbytes+=bytecount;
    
    //only process messages from the vibe mod
    if(latestLine.indexOf("VibeIntiface")>0){
        const message = latestLine.slice(latestLine.lastIndexOf("]")+2)
        const params = message.split(" ");
        switch (params[0]){
            case "DAMAGE":
                const vibeMultiplier = params[1] == "TAKEN" ? 0.5 : 1; //half the strength if the damage was taken full strength if given, rewards good play
                const strength = (vibeMultiplier * parseFloat(params[2]))/2 //strength is half the power of damage dealt and 1/4 of damage taken
                await vibrateDevice(deviceGlobal, strength, 100)
            break;

            case "TILE":
                if(params[1] == "DIG"){
                    await vibrateDevice(deviceGlobal, 0.1, 100)
                }
            break;

            case "SPELL":
                if(params[1] == "CAST"){
                    await vibrateDevice(deviceGlobal, 0.5, 300)
                    await vibrateDevice(deviceGlobal, 0.6, 300)
                    await vibrateDevice(deviceGlobal, 0.7, 300)
                }
            break;

            case "ITEM":
                if(params[1] == "PICKUP"){
                    await vibrateDevice(deviceGlobal, 0.3, 100)
                }
                if(params[1] == "USE"){
                    await vibrateDevice(deviceGlobal, 0.5, 200)
                }
            break;

            case "LEVEL":
                if(params[1] == "LOAD"){
                    await vibrateDevice(deviceGlobal, 0.5, 300)
                    await vibrateDevice(deviceGlobal, 0.4, 300)
                    await vibrateDevice(deviceGlobal, 0.3, 300)
                }
                if(params[1] == "COMPLETE"){
                    await vibrateDevice(deviceGlobal, 0.8, 300)
                    await vibrateDevice(deviceGlobal, 0.9, 350)
                    await vibrateDevice(deviceGlobal, 1.0, 400)
                }
            break;
        }
    }
    process.nextTick(readLogs);
}

async function connect(){
    //build client
    const connector = new Buttplug.ButtplugNodeWebsocketClientConnector(`${address}:${port}`);
    const client = new Buttplug.ButtplugClient("NecroVibeMod");

    //event listener add device
    client.addListener("deviceadded", async (device) => {
        console.log(`Device Connected: ${device.name}`);
        if (device.vibrateAttributes.length == 0) {
            return;
        }
        await vibrateConfirmConnect(device)

        if(fs.existsSync(logAddress)){
            console.log("log file exists!");
        }else{
            return;
        }

        //clear the log file before starting to read
        fs.writeFileSync(logAddress, "");

        //read log file
        fs.open(logAddress, "r", function(err, fd) {
            console.log("READING");
            //set global variables for the read/send functions
            fdGlobal = fd;
            deviceGlobal = device;
            readLogs();
        });
    });

    //event listener remove device
    client.addListener("deviceremoved", (device) => console.log(`Device Removed: ${device.name}`));

    //connect client
    try{
        await client.connect(connector);
        console.log("Client connected");
    }catch(e){
        console.log(e);
        return;
    }
    
    await client.startScanning();
}

connect()