import React from 'react';

// just an input to easily use and customize
// by default autoComplete is off
export default class Inputs extends React.Component {
    constructor(props) {
        super(props);

        this.state=({
            value: props.value,
            placeholder: props.placeholder || '',
            className: props.className || '',
            id: props.id || '',
            type: props.type || '',
            variable: props.variable,
            autoComplete: props.autoComplete || "off",
        })
    }

    handleUpdate(e) {
        const value = e.target.value;
        this.setState({
            value: value,
        })
        this.props.parentCallBack(this.state.variable, value);
    }
    // lets it update the value from parent function
    static getDerivedStateFromProps(props, state) {
        state = {
            value: props.value,
        };
        return state;
    }

    render() {
        return (
            <input
                className={this.state.className}
                id={this.state.id}
                value={this.state.value}
                placeholder={this.state.placeholder}
                type={this.state.type}
                onChange={(e) => this.handleUpdate(e)}
                autoComplete={this.state.autoComplete}
            />
        )
    }
}


/*
LAYOUT: 
<Inputs
    className=
    type=
    id=
    placeholder=
    value=
    variable=
    parentCallBack=
    />

// ADD THIS FUNCTION: 
  handleCallBack(variable, value) {
    this.setState({
        [variable]: value,
    })
  }
*/                          