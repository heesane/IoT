import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MemoryIcon from '@mui/icons-material/Memory';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Cookies } from 'react-cookie';

import Device from '../components/Device';
import NewDevice from '../components/NewDevice';
import mqtt_options, {ws_protocol} from './mqtt_user.js';

import "../style/Devices.css";

import mqtt from 'mqttws/dist/mqtt';

// it assumes the mqtt and the management console web is on the same hosts.
// if they are on different hosts, the the following two lines should be modified.
const svr = window.location;
let rootURL = process.env.API_SERVER || svr.protocol+'//'+svr.hostname+':2009';
let mqtturl = process.env.WS_SERVER  || ws_protocol + svr.hostname + ':9001';
let mqttClient = mqtt.connect(mqtturl, mqtt_options);

const Devices = (props) => {
    const token = props.token;
    const [devices, setDevices] = useState([]);
    const [deleted, setDeleted] = useState(false);
    const [added, setAdded] = useState(false);
    const [newDev, setNewDev] = useState(false);
    const [chosenDevice, setChosenDevice] = useState(undefined);

    useEffect(() => {
        fetch(rootURL + '/devices',
            {
                method: 'get',
                headers: { "Authorization": 'Bearer ' + token },
            })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    const cookies = new Cookies();
                    cookies.set('token', '');
                    window.location.reload();
                    return [];
                }
            })
            .then((data) => {
                setDevices(data);
            })
            .catch((err) => {
                console.log(err);
            });

        setAdded(false);
        setDeleted(false);
    }, [deleted, added, token]);

    useEffect(() => {
        setTimeout(() => {
            mqttClient.subscribe('iot3/+/evt/connection/fmt/json', {qos:0});
        }, 300);
        mqttClient.on('message', (topic, message) => {
            let mObj = JSON.parse(message.toString());
            if (mObj.d && mObj.d.status) {
                let devId = topic.split('/')[1];
                let statusCell = document.getElementById(devId + '-status');
                if (statusCell) {
                    if (mObj.d.status === 'online') {
                        statusCell.innerHTML = 'on';
                    } else if (mObj.d.status === 'offline') {
                        statusCell.innerHTML = 'off';
                    }
                }
            }
        });

        return () => {
            mqttClient.unsubscribe('iot3/+/evt/connection/fmt/json');
        };
    }, []);

    const rows = devices.map((device) => (
        {
            id: device.devId,
            online: device.status || 'off',
            createdDate: device.createdDate,
            type: device.type,
            createdBy: device.createdBy,
            navigate: <IconButton onClick={()=>setChosenDevice(device)}>
                <MemoryIcon/>
            </IconButton>
        }
    ));

    return (
        <div className="devices-container">
            {chosenDevice ?
                (
                    <Device chosenDevice={chosenDevice} setDeleted={setDeleted} token={token} setChosenDevice={setChosenDevice} mqttClient={mqttClient}/>
                ) : (
                    <div>
                        {newDev && <NewDevice setNewDev={setNewDev} setAdded={setAdded} token={token} setChosenDevice={setChosenDevice} />}
                        {!newDev && <>
                            <div className='newDevTitle'>
                                <h1>Device List</h1>
                                <Button startIcon={<MemoryIcon/>} sx={{ height: '36.5px' }} size="medium" variant="contained" onClick={()=>{setNewDev(true)}}>New Device</Button>
                            </div>
                            <TableContainer sx={{ height: 700, width: '100%' }} component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Device Id</TableCell>
                                            <TableCell>online</TableCell>
                                            <TableCell>Type</TableCell>
                                            <TableCell>Created By</TableCell>
                                            <TableCell>Created Date</TableCell>
                                            <TableCell>Detail</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rows.map((row) => (
                                            <TableRow
                                                key={row.id}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell>{row.id}</TableCell>
                                                <TableCell id={row.id + '-status'}>{row.online}</TableCell>
                                                <TableCell>{row.type}</TableCell>
                                                <TableCell>{row.createdBy}</TableCell>
                                                <TableCell>{row.createdDate}</TableCell>
                                                <TableCell>{row.navigate}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </>}
                    </div>
                )
            }
        </div>
    )
}

export default Devices;