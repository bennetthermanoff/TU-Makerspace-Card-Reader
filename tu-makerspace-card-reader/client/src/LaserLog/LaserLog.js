import { useEffect } from "react"
import { laserLog } from "../APIRoutes";
import axios from 'axios';
const LaserLog = ({lastRFID, setLastRFID}) => {



    useEffect(() => {
        console.log(lastRFID);
        if(lastRFID){
            axios(laserLog(lastRFID)).then(async (res) => {
                console.log(res);
                await new Promise(resolve =>
                    setTimeout(resolve, 1500)
                );
                setLastRFID();
            }
            );
        }
       

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