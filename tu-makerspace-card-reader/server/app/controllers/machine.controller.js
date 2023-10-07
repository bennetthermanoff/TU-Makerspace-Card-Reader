const db = require("../models");
const bcrypt = require('bcrypt');

const Machines = db.machine;
const MachineLog = db.machineLog;
const Users = db.user;
const Op = db.Sequelize.Op;

exports.create = async (req, res) => {
    try {
        if (!req.body.name || !req.body.user || !req.body.authPassword) {
            res.status(400).send({
                message: "Content cannot be empty!"
            });
            return;
        }

        const machine = {
            name: req.body.name,
            status: false,
            description: req.body.description,
            requiredTraining: req.body.requiredTraining,
            taggedOut: false,
            group: req.body.group
        };

        const authUser = {
            email: req.body.user,
            password: req.body.authPassword
        };

        const usera = await Users.findOne({ where: { email: authUser.email } });
        const result = await bcrypt.compare(authUser.password, usera.password);

        if (result && usera.admin) {
            const data = await Machines.create(machine);
            res.send(data);
        } else {
            res.status(400).send({
                message: "Incorrect Password or Credentials!"
            });
        }
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Machine"
        });
    }
};

exports.findAll = async (req, res) => {
    try {
        const group = req.query.group;
        const condition = group ? { group: { [Op.like]: `%${group}%` } } : null;
        const data = await Machines.findAll({ where: condition });
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Machines."
        });
    }
};


exports.findOne = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Machines.findByPk(id);
        
        if (data) {
            res.send(data);
        } else {
            res.status(404).send({
                message: `Cannot find Machine with id=${id}.`
            });
        }
    } catch (err) {
        res.status(500).send({
            message: "Error retrieving Machine with id=" + id
        });
    }
};


exports.update = async (req, res) => {
    try {
        if (!req.body.user || !req.body.updatedMachine) {
            res.status(400).send({
                message: "Content cannot be empty!"
            });
            return;
        }

        const authUser = {
            id: req.body.user,
        };

        const usera = await Users.findOne({ where: { id: authUser.id } });

        if (usera.fabTech) {
            const machine = req.body.updatedMachine;
            const id = req.params.id;

            const num = await Machines.update(machine, {
                where: { id: id }
            });

            if (num == 1) {
                const data = await Machines.findByPk(id);
                await MachineLog.create({
                    machineName: data.name,
                    machineId: id,
                    userId: usera.id,
                    userName: usera.name,
                    time: Date.now(),
                    action: machine.taggedOut ? "Tagged Out" : machine.description.indexOf("Unlisted reason") === -1 ? "Reason Updated: " + machine.description : "Tagged In"
                });

                res.send({
                    message: "Machine was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Machine with id=${id}. Maybe Machine was not found or req.body is empty!`
                });
            }
        }
    } catch (err) {
        res.status(500).send({
            message: "Error updating Machine: " + err.message
        });
    }
};

exports.findAll = async (req, res) => {
    try {
        const name = req.query.name;
        const condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
        const data = await Machines.findAll({ where: condition });
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Machines."
        });
    }
};

exports.findAllGroup = async (req, res) => {
    try {
        const data = await Machines.findAll({ where: { group: req.params.group } });
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Machine group"
        });
    }
};


//URL is machine id, requires userID
exports.toggleMachine = async (req, res) => {
    try {
        if (!req.body.userID) {
            res.status(400).send({
                message: "Content cannot be empty!"
            });
            return;
        }

        const authUser = {
            id: req.body.userID
        };

        const machine = await Machines.findByPk(req.params.id);
        const user = await Users.findOne({ where: { id: authUser.id } });

        if (user[machine.requiredTraining]) {
            const userName = user.name;
            const userId = user.id;
            const updatedMachine = req.body;
            machine.status = !machine.status;
            const id = req.params.id;

            const num = await Machines.update(
                { status: machine.status, lastUserName: userName },
                { where: { id: machine.id } }
            );

            if (num == 1) {
                res.send({
                    message: "Machine was updated successfully."
                });

                await MachineLog.create({
                    machineName: machine.name,
                    machineId: machine.id,
                    userId: userId,
                    userName: userName,
                    time: Date.now(),
                    action: machine.status ? "Turned On" : "Turned Off"
                });
            } else {
                res.send({
                    message: `Cannot update Machine with id=${id}. Maybe Machine was not found or req.body is empty!`
                });
            }
        } else {
            res.status(400).send({
                message: "Insufficient Permission!"
            });
        }
    } catch (err) {
        res.status(500).send({
            message: "Error toggling Machine: " + err.message
        });
    }
};

exports.logLaser = async (req, res) => {
    try {
        if (!req.body.userID) {
            res.status(400).send({
                message: "Content cannot be empty!"
            });
            return;
        }

        const authUser = {
            id: req.body.userID
        };

        const machine = await Machines.findByPk(75);
        const user = await Users.findOne({ where: { id: authUser.id } });

        await MachineLog.create({
            machineName: machine.name,
            machineId: machine.id,
            userId: user.id,
            userName: user.name,
            time: Date.now(),
            action: "Laser Fired"
        });

        res.status(200).send({
            message: "Logged Laser Fired" + user.name
        });
    } catch (err) {
        res.status(500).send({
            message: "Error logging Laser Fired: " + err.message
        });
    }
};


exports.disableMachine = async (req, res) => {
    try {
        const machine = await Machines.findByPk(req.params.id);

        if (machine.status) {
            machine.status = !machine.status;

            const num = await Machines.update(
                { status: machine.status },
                { where: { id: machine.id } }
            );

            if (num == 1) {
                res.send({
                    message: "Machine was updated successfully."
                });

                await MachineLog.create({
                    machineName: machine.name,
                    machineId: machine.id,
                    userId: 0,
                    time: Date.now(),
                    action: "Turned Off"
                });
            } else {
                res.send({
                    message: `Cannot update Machine with id=${machine.id}. Maybe User was not found or req.body is empty!`
                });
            }
        } else {
            res.status(200).send({
                message: "Machine already disabled!"
            });
        }
    } catch (err) {
        res.status(500).send({
            message: "Error disabling Machine: " + err.message
        });
    }
};
