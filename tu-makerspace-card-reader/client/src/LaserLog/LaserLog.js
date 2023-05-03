import { useEffect } from "react"
import { laserLog } from "../APIRoutes";
import axios from 'axios';
const LaserLog = ({lastRFID, setLastRFID}) => {
    useEffect(() => {
        console.log(lastRFID);
        axios(laserLog(lastRFID)).then((res) => {
            console.log(res);
        }
        );

    }
    , [lastRFID])
    return (
        <div>
            <h1>Log</h1>
            <p>{lastRFID}</p>
        </div>
    )
}
export default LaserLog;