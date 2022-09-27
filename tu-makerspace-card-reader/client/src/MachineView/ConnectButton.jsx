import React, { useEffect, useState } from "react";


export const ConnectButton = ({ machines, machineGroup, editMachines }) => {
    const [isConnected, editIsConnected] = useState(false);
    const [usbReader, setUsbReader] = useState();
    const [usbWriter, setUsbWriter] = useState();
    const [machineOne, toggleMachineOne] = useState(false);
    console.log(isConnected)

    const _connectDevices = async () => {
        let device;
        console.log('here');
        // await navigator.serial.getPorts(async(ports)=>{
        //     console.log(ports,'ports');
        // })
        navigator.serial.requestPort({
            filters: [
                { usbVendorId: 0x2341, usbProductId: 0x0043 }, // vid:     // pid: 
                { usbVendorId: 0x2341, usbProductId: 0x0001 }, // vid:     // pid: 
                { usbVendorId: 0x10c4, usbProductId: 0xea60 }  // vid:     // pid:
            ]
        })
            .then(async (port) => {

                await port.open({ baudRate: 9600 });
                // eslint-disable-next-line no-undef
                const textDecoder = new TextDecoderStream();
                const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
                // eslint-disable-next-line no-undef
                const textEncoder = new TextEncoderStream();
                const writableStreamClosed = textEncoder.readable.pipeTo(port.writable);
                await new Promise(resolve =>
                    setTimeout(resolve, 1500)
                );

                machines.forEach(async (machine) => {
                    if (machine.status)
                        await usbWriter.write("I" + String(machine.id) + ".");
                    else
                        await usbWriter.write("O" + String(machine.id) + ".");
                }, [machines])


                setUsbReader(textDecoder.readable.getReader());
                setUsbWriter(textEncoder.writable.getWriter());
                editIsConnected(true);

                // _getMachineStatusFromArduino();

            });


    }
    const _getMachineStatusFromArduino = async () => {
        await new Promise(resolve =>
            setTimeout(resolve, 500)
        );
        await usbReader.read();
        await usbWriter.write("R");
        await new Promise(resolve =>
            setTimeout(resolve, 500)
        );
        const { value, done } = await usbReader.read();
        console.log(value)
        const stringValue = String(value);
        const enabledMachineIds = stringValue.split("R").pop().split(',');
        console.log('enabledMachineIds', enabledMachineIds);
        let newMachines = [];
        machines.forEach((machine) => {
            machine.status = false;
            enabledMachineIds.forEach((enabledMachineId) => {
                if (machine?.id == enabledMachineId) {
                    machine.status = true;
                }
            })
            newMachines.push(machine)
        })
        console.log('newMachines', newMachines);
        editMachines(newMachines)
    }
    const _readValue = async () => {
        const { value, done } = await usbReader.read();
        if (done) return value;
    }
    const _toggleMachine = async (machineId, machineStatus) => {
        if (isConnected) {
            if (machineStatus)
                await usbWriter.write("I" + String(machineId) + ".");
            else
                await usbWriter.write("O" + String(machineId) + ".");
            // const {value, done} =await usbReader.read()
            // console.log(value,'readValue');

        }

    }
    useEffect(async () => {
        if (isConnected) {
            console.log('SIDE EFFECT', machines);

            machines.forEach(async (machine) => {
                await _toggleMachine(machine?.id, machine?.status)
            })
        }
    })

    return (!isConnected ? <button className="connect-button" id="second-connect-button" onClick={_connectDevices}>connect</button> : null)
}


// export const ConnectButton2 = ({ machines, machineGroup, editMachines }) => {
//     const [isConnected, editIsConnected] = useState(false);
//     console.log(isConnected)

//     const _connectDevices = async () => {
//         let device;
//         console.log('here');
//         navigator.usb.requestDevice({ filters: [{ vendorId: 0x2341 }] })
//             .then(selectedDevice => {
//                 device=selectedDevice
//                 device.open(); // Begin a session.
//             })
//             .then(() => device.selectConfiguration(1)) // Select configuration #1 for the device.
//             .then(() => device.claimInterface(2)) // Request exclusive control over interface #2.
//             .then(() => device.controlTransferOut({
//                 requestType: 'class',
//                 recipient: 'interface',
//                 request: 0x22,
//                 value: 0x01,
//                 index: 0x02
//             })) // Ready to receive data
//             .then(() => device.transferIn(5, 64)) // Waiting for 64 bytes of data from endpoint #5.
//             .then(result => {
//                 const decoder = new TextDecoder();
//                 console.log('Received: ' + decoder.decode(result.data));
//             })
//             .catch(error => { console.error(error); });
//     }
//     return (!isConnected ? <button onClick={_connectDevices}>connect</button> : null)
// }
