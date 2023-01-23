import React, { useState, useEffect } from "react";
import { serial } from 'web-serial-polyfill';
import { SerialPort } from 'web-serial-polyfill';

export const PersistentRFIDConnectButton = ({ lastRFID, setLastRFID }) => {
    const [isConnected, editIsConnected] = useState(false);
    const [usbReader, setUsbReader] = useState();
    const [isReading, setIsReading] = useState(false);
    let currentId = ''
    let mySerial;
    console.log(isConnected)

    const _readValue = async () => {
        console.log('startread');
        while (isConnected) {
            try {


                await usbReader.read().then(({ value }) => {
                    value = ab2str(value);
                    for (const char of value) {
                        console.log(char, 'char');
                        if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'].includes(char)) {
                            currentId += char
                            console.log(currentId, 'currID');

                        }
                        else {
                            if (currentId != '') {
                                console.log('return', currentId);
                                if (currentId != lastRFID) {
                                    setLastRFID(currentId);
                                }
                                currentId = '';

                            }


                        }

                    }
                });




            } catch (error) {
            }

        }
    }
    const _connectDevices = async () => {
        navigator.usb.requestDevice({filters: [
            { usbVendorId: 0x0403, usbProductId: 0x6001 }
        ]}).then(
            async (device) => {
                mySerial = new SerialPort(device);
                await mySerial.open({ baudRate: 9600 });
                setUsbReader(mySerial.readable.getReader());
                
                editIsConnected(true);
                
            }
        );


    

    _readValue();
    await new Promise(resolve =>
        setTimeout(resolve, 500)
    );
    _readValue();
}
const str2ab = function (str) {
    var buf = new Uint8Array(str.length); // 1 byte for each char
    for (var i = 0, strLen = str.length; i < strLen; i++) {
        buf[i] = str.charCodeAt(i);
    }
    return buf;
}

const ab2str = function (buf) {
    return String.fromCharCode.apply(null, buf);
}






return (!isConnected ? <button className="global-connect-button" onClick={_connectDevices}>connect</button> : isReading ? null : <button onClick={() => { setIsReading(true); _readValue() }} >{`Start Card Read (SCAN NEW CARD FIRST)`}</button>)
}


