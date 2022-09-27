import '../MachineView/machineView.css';
import './frontpagemachines.css';
import { getMachines } from '../APIRoutes.js';
import Machine from './Machine.js';
import React from 'react';
import axios from 'axios';

export class FrontPageMachines extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      machines: [{
        "name": "loading",
        "id": 0,
        "status": false,
        "requiredTraining": "nullTraining",
      }],

    }
  }
  componentDidMount = async () => { //gets called when component starts, gets machines for specific machinegroup from api
    console.log('attempt to mount');
    axios(getMachines()).then((response, err) => {
      if (err) {
        console.log("error getting enabled machines");
      }
      else {
        console.log(response.data);
        this.setState({
          machines: []
        })
        this.setState({
          machines: response.data.filter((mach) => mach.status === true || mach.taggedOut === true),
        });
      }
    });
    while (true) {
      await new Promise(resolve =>
        setTimeout(resolve, 5000)
      );
      axios(getMachines()).then((response, err) => {
        if (err) {
          console.log("error getting enabled machines");
        }
        else {
          this.setState({
            machines: response.data.filter((mach) => mach.status === true || mach.taggedOut === true),
          });
        }
      });
    }


  }

  render() {
    return (
      <>
        <div className='container-out'>
          {this.state.machines.filter((mac) => mac.taggedOut === true).map((mach) => (
            <Machine
              machine={mach}
              machineID={mach.id}
              machineName={mach.name}
              activated={mach.status}
              taggedOut={mach.taggedOut}
              description={mach.description}
            />
          ))}

        </div>
        <div className='container-on'>
          {this.state.machines.filter((mac) => mac.status === true).map((mach) => (
            <Machine
              machine={mach}
              machineID={mach.id}
              machineName={mach.name}
              activated={mach.status}
              taggedOut={mach.taggedOut}
              description={mach.description}
            />
          ))}
        </div>

      </>
    );
  }



}
