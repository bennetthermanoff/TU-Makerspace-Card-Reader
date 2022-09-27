import React from 'react';
import './EditUser.css';
import Checkbox from '@mui/material/Checkbox';
import { FormControlLabel } from '@mui/material';
import Typography from '@mui/material/Typography';

// displays the checkboxes based on the trainings
export default function DisplayChecks(props) {
    return (
        <div className="containerChecks">
            {(props.trainings).map((training) => (
                <h1 key={training}>
                    <FormControlLabel
                        label={<Typography id="text2" color="textSecondary">{training[0]}</Typography>}
                        control={
                            <Checkbox
                                className="checks"
                                color="success"
                                inputprops={training}
                                checked={training[1]}
                                size="medium"
                                onChange={() => props.handleChange(training)}
                            />
                        }
                    />
                </h1>
            ))
            }
            <FabTechToggle
                isAdmin={props.isAdmin}
                userIsFabTech={props.userIsFabTech}
                handleChange={props.handleChange}
                trainings={props.trainings}
                toggleFabTech={props.toggleFabTech}
            />

        </div>
    )
}



function FabTechToggle(props) {
    if (props.isAdmin && props.trainings.length !== 0) {
        return (
            <div>
                <FormControlLabel
                    label={<Typography id="text2" variant="body2" color="textSecondary">Fab Tech</Typography>}
                    control={
                        <Checkbox
                            color="secondary"
                            checked={props.userIsFabTech}
                            size="medium"
                            onChange={() => props.toggleFabTech()}
                        />
                    }
                />
            </div>
        )
    } else {
        return null;
    }
}