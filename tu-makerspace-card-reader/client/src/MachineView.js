import './machineView.css';
import mill from './mill.png';
import bandsaw from './bandsaw.jpeg';
import tempimage from './tempimage.png';
import axios from 'axios';
import SwitchUnstyled from '@mui/base/SwitchUnstyled';
import React from 'react';
import { getUser, disableMachine, toggleMachine, getAllMachines, editMachine } from './APIRoutes';
import Root from './switchtheme.js'
import './DarkMode.css'
function AdminButton(props) {
  if (props.isFabTech) {
    return (
      <button className="BetterBox" onClick={() => props.toggleFabTechView()}>Tag Out</button>
    )
  } else {
    return null;
  }
}
export default class MachineView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFabTech: false,
      fabTechView: false,
      value: '',
      $error: false,// added $ before boolean
      currentUser: {
        "name": "Enter ID",
        "nullTraining": false,
      },
      machineGroup: props.machineGroup,
      machines: [{
        "name": "loading",
        "id": 0,
        "status": false,
        "requiredTraining": "nullTraining",
      }], //temporary "loading" machine that gets overirdden in componentdidmount()
    };
    
    this.toggleFabTechView = this.toggleFabTechView.bind(this);
  }
  componentDidMount() { //gets called when component starts, gets machines for specific machinegroup from api
    axios(getAllMachines(this.state.machineGroup)).then((response, error) => {
      if (error) {
        console.log("error getting machines");
      }
      else {
        console.log(response.data);
        this.setState({
          machines: []
        })
        this.setState({
          machines: response.data,
          currentUser: {
            "name": "Enter ID",
            "nullTraining": false
          },
        });
      }
    });

  }
  handlenewSearch = (event) => { //called when search box is changed. updates user which is referenced by Machine component for perms

    const value = event.target.value;
    this.setState({
      value: value,
    })
    if (value !== '') { // added this to unset error
      axios(getUser(event.target.value)).then((response, err) => {
        console.log(response.data);
        if (response.data.name) {
          console.log("name set: " + response.data.name);
          this.setState({
            currentUser: response.data,
            $error: false,
            isFabTech: response.data.fabTech,
            fabTechView: false,
          });
          //currentUser is set in state of search, need to build function to check user perms and apply to machines as they are mapped
        }
        else {
          console.log("error fetching name: " + err);
          this.setState({
            $error: true,
            currentUser: { 
              "name": "Enter ID", 
            "nullTraining": false 
          },
          });

        }
      }).catch((err) => {
        console.log("error fetching name: " + err);
        this.setState({
          $error: true,
          currentUser: {
            "name": "Enter ID", 
            "nullTraining": false 
          },
        });
      });
    } else { // unsets error when empty
      this.setState({
        error: false,
        currentUser: {
          "name": "Enter ID",
          "nullTraining": false,
        },
      })
    }

  }

  handleLogOut() {
    this.setState({
      isFabTech: false,
      fabTechView: false,
      value: '',
      $error: false,
      currentUser: {
        "name": "Enter ID",
        "nullTraining": false,
      },
    })
  }
  toggleFabTechView() {
    this.setState((currentState) => {
      return {
        fabTechView: !currentState.fabTechView,
      }
    })
    
  }

  render() {
    let err = this.state.$error;
    return (

      <div>
        <div id="adminToggle">
          <AdminButton 
            isFabTech={this.state.isFabTech}
            toggleFabTechView={this.toggleFabTechView}
            />
        </div>
        <div className='login-container' align="left">
          {/* Create textfield for user input, highlights red if error! Blue if valid name! */}
          <h3 id="otherh3">Name: {this.state.currentUser.name !== "Enter ID" ? this.state.currentUser.name : ' '}</h3>

          <input
            id={err === true ? "input2true" : "input2false"}
            className='BetterTextField'
            placeholder={this.state.currentUser.name}
            $error={this.state.$error}
            value={this.state.value}
            onChange={this.handlenewSearch}
            autoComplete="off"
          />
          <button
            className="BetterBox"
            onClick={() => this.handleLogOut()}
          > Log Out </button>
        </div>

        {/* Creates multiple machines from the machine[] state! Machine state is filled on component load and is called via api GET machines/group/groupname */}
        {/* Change the machinegroup prop when you render the search component to set which tablet this is run on  */}
        <div className='container2'>
          {this.state.machines.map((machine) => (
            <Machine

              machineID={machine.id}
              machineName={machine.name}
              currentUser={this.state.currentUser}
              activated={machine.status}
              trained={this.state.currentUser[machine.requiredTraining]}
              taggedOut={machine.taggedOut}
              isFabTech={this.state.isFabTech}
              fabTechView={this.state.fabTechView}
              userID={this.state.currentUser.id}
            />
          ))}
        
        </div>


      </div>

    )
  }

}

class Machine extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      machineID: props.machineID,
      machineName: props.machineName,
      activated: props.activated,
      currentUser: props.currentUser,
      image: this.getImage(props.machineName, props.machineID),
      trained: props.trained,
      fabTechView: props.fabTechView,
      taggedOut: props.taggedOut,
      userID: props.userID,
    };
  }

  //used to determine which image to grab for machine diplay. may move this to its own file later to clean up code.
  getImage(machineName) {
    //console.log(machineName + " " + machineID);
    if (machineName === "CNC Mill") {
      return mill;
    }
    else if (machineName === 'Bandsaw') {
      return bandsaw;
    }
    else {
      return tempimage;
    }

  }

  //used to update buttons with perms on user change. does not change activated state on machine, so remote disable is not supported atm. to be supported if deemed needed.
  static getDerivedStateFromProps(props, state) {
    state = {
      currentUser: props.currentUser,
      currentUser: props.currentUser,
      trained: props.trained,
      fabTechView: props.fabTechView,
      userID: props.userID,
    };
    return state
  }
  //called when button is clicked, changes state and calls api to database
  onButtonChange() {
    if (this.state.activated) {
      this.setState({ activated: false });
      axios(disableMachine(this.state.machineID));
    }
    else {
      axios(toggleMachine(this.state.machineID, this.state.currentUser.id))
        .then((res, err) => {
          if (err) {
            console.log("Error setting Machine State!");
          }
          if (res.data.message != "Insufficent Permission!") {
            this.setState({
              activated: !this.state.activated
            });
          }
          else {
            console.log("Insufficent Permission!");
          }
        })

      //console.log('enabled ' + this.state.machineName);
      //console.log('key: ' + this.state.machineID);
    }
  }
  handleToggleTagOut() {
    if (this.state.fabTechView) {
    axios(editMachine(this.state.machineID, {"taggedOut":!this.state.taggedOut}, this.state.userID))
      .then((response, error) => {
        if (error) {
          console.log('Error tagging in/out');
        } else {
          console.log('Success tagging in/out');
          this.setState((currentState) => {
            return {
              taggedOut: !currentState.taggedOut,
              activated: false,
            }
          })

        }
      }).catch((err) => {
        console.log(err);
      })
    }
    
  }

  render() {
    return (

      <div className="MachineBoxContainer" align="center">
        
        <div className={this.state.activated ? "MachineBoxBorder" : 'MachineBoxBorder-false'}>
            
            <img src={this.state.image} className={this.state.activated ? "MachineBoxTrue" : "MachineBox"} />
            <button className={this.state.fabTechView ? "AdminToggle": "AdminToggleFalse"} id={this.state.taggedOut ? "tagged-out-true" : "tagged-out-false"} onClick={() => this.handleToggleTagOut()} ></button>
        </div>
        <span>
          <span id="otherh3-2">{this.state.machineName}

            <SwitchUnstyled
              component={Root}
              id="switch"
              className="toggle"
              checked={this.state.activated}
              size="medium"
              color="success"
              disabled={(!this.state.trained && !this.state.activated) || this.state.taggedOut}
              inputprops={{ 'aria-label': 'Checkbox demo' }}
              onChange={() => this.onButtonChange()}
            />
          </span>
        </span>

      </div>

    );
  }
}
