import '../MachineView/machineView.css';
import { getAllMachinesOn, getAllMachinesTaggedOut } from '../APIRoutes.js';
import Machine from '../MachineView/MachineView.js';
import React from 'react';
import axios from 'axios';

export class NotableMachines extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            machines: [],
        
        }
    }
    componentDidMount() { //gets called when component starts, gets machines for specific machinegroup from api
        console.log('attempt to mount');
        axios(getAllMachinesOn()).then((response, err) => {
          if (err) {
            console.log("error getting enabled machines");
          }
          else {
            // console.log(response.data);
            this.setState({
              machines: []
            })
            this.setState({
              machines: response.data,
            });
            axios(getAllMachinesTaggedOut()).then((response, error) => {
                if (error) {
                    console.log("error getting tagged out machines");
                }
                else {
                    this.setState((currentState) => {
                        return {
                            machines: currentState.machines + response.data,
                        }
                    })
                }
            })
          }
        });
    
      }

    render() {
        return (
            <div>
        <div className='container2'>
          {this.state.machines.map((mach) => (
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
       
        </div>
        );
          }



}
