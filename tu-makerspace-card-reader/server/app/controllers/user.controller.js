const db = require("../models");
const bcrypt = require('bcrypt');
const Users = db.user;
const UserEditLog = db.userEditLog;
const Op = db.Sequelize.Op;

// Create and Save a new Tutorial



exports.create = async (req, res) => {
    try {
        // Validate request
        console.log(req.body);
        if (!req.body.name || !req.body.splash || !req.body.email || !req.body.id || !req.body.user) {
            res.status(400).send({
                message: "Content cannot be empty!"
            });
            return;
        }

        // Create a user
        const user = {
            name: req.body.name,
            splash: req.body.splash,
            email: req.body.email,
            fabTech: 0,
            mill: 0,
            lathe: 0,
            waterjet: 0,
            wood1: 0,
            wood2: 0,
            metal1: 0,
            metal2: 0,
            admin: 0,
            password: "",
            id: req.body.id,
        };

        const authUser = {
            id: req.body.user,
        };

        const usera = await Users.findOne({ where: { id: authUser.id } });

        if (usera.fabTech || usera.admin) {
            const data = await Users.create(user);
            res.send(data);
        } else {
            res.status(400).send({
                message: "Incorrect Password or Credentials!"
            });
        }
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the User."
        });
    }
};

// Retrieve all users from the database.
exports.findAll = async (req, res) => {
    try {
        const name = req.query.name;
        const condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
        const data = await Users.findAll({
            where: condition,
            attributes: { exclude: ['password'] }
        });
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving users."
        });
    }
};

// Find a single user with an id
exports.findOne = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Users.findByPk(id);

        if (data) {
            data.password = data.password !== '';
            res.send(data);
        } else {
            res.status(404).send({
                message: `Cannot find User with id=${id}.`
            });
        }
    } catch (err) {
        res.status(500).send({
            message: "Error retrieving User with id=" + req.params.id
        });
    }
};

exports.findEmail = async (req, res) => {
    try {
        const email = req.params.email;
        const data = await Users.findOne({ where: { email: email } });

        if (data) {
            data.password = data.password !== '';
            res.send(data);
        } else {
            res.status(404).send({
                message: `Cannot find User with email=${email}.`
            });
        }
    } catch (err) {
        res.status(501).send({
            message: "Error retrieving User with email=" + req.params.email
        });
    }
};

// exports.verify = (req, res)=> {
//     const email = req.params.email;
//     const password = req.body.password;
//     Users.findOne({ where: { email: email } })
//         .then(data => (
//             res.send({message: "hi"})
//         ))
// }
exports.verify = async (req, res) => {
    try {
        if (!req.body.password || req.body.password === '') {
            res.status(401).send({
                message: "Content can not be empty!"
            });
            return;
        }

        const userb = {
            email: req.params.email,
            password: req.body.password,
        };

        const usera = await Users.findOne({ where: { email: userb.email } });

        if (bcrypt.compareSync(userb.password, usera.password)) {
            if (usera.fabTech || usera.admin) {
                res.send({
                    isFabTech: usera.fabTech,
                    isAdmin: usera.admin,
                    message: true
                });
            } else {
                res.send({
                    message: false
                });
            }
        } else {
            res.status(401).send({
                message: "Incorrect Password"
            });
        }
    } catch (err) {
        res.status(500).send({
            message: "Error verifying user: " + err.message,
        });
    }
};



// Update a user by the id in the request
exports.update = async (req, res) => {
    try {
        if (!req.body.updatedUser || !req.body.user || !req.body.authPassword) {
            res.status(400).send({
                message: "Content can not be empty!"
            });
            return;
        }

        const authUser = {
            id: req.body.user,
            password: req.body.authPassword
        };

        const usera = await Users.findOne({ where: { id: authUser.id } });

        if (bcrypt.compareSync(authUser.password, usera.password) && !(req.body.admin && !usera.admin) && !(req.body.fabTech && !usera.admin) && (usera.fabTech || usera.admin)) {
            let user = req.body.updatedUser;
            if (req.body.updatedUser.password) {
                user.password = bcrypt.hashSync(req.body.updatedUser.password, 10);
            }

            const id = req.params.id;

            const oldUser = await Users.findOne({ where: { id: id } });

            const num = await Users.update(user, {
                where: { id: id }
            });

            if (num[0] === 1) {
                Object.keys(user).forEach(async key => {
                    await UserEditLog.create({
                        userId: oldUser.id,
                        userName: oldUser.name,
                        updatedById: usera.id,
                        updatedByName: usera.name,
                        time: Date.now(),
                        action: "update",
                        field: key,
                        oldValue: oldUser[key],
                        newValue: user[key]
                    });
                });
                res.send({
                    message: "User was updated successfully."
                });
            } else {
                res.status(500).send({
                    message: "Error updating User with id=" + id
                });
            }
        } else {
            res.status(400).send({
                message: "Incorrect Password or Higher permission required!"
            });
        }
    } catch (err) {
        res.status(500).send({
            message: "Error updating User: " + err.message
        });
    }
};

// Delete a user with the specified id in the request
exports.delete = async (req, res) => {
    try {
        if (!req.body.user || !req.body.authPassword) {
            res.status(400).send({
                message: "Content can not be empty!"
            });
            return;
        }

        const authUser = {
            email: req.body.user,
            password: req.body.authPassword
        };

        const usera = await Users.findOne({ where: { email: authUser.email } });

        if (bcrypt.compareSync(authUser.password, usera.password)) {
            const id = req.params.id;
            const num = await Users.destroy({ where: { id: id } });

            if (num == 1) {
                res.send({
                    message: "User was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete User with id=${id}. Maybe User was not found!`
                });
            }
        } else {
            res.status(400).send({
                message: "Incorrect Password!"
            });
        }
    } catch (err) {
        res.status(500).send({
            message: "Error deleting User: " + err.message,
        });
    }
};

// Delete all users from the database.
exports.deleteAll = async (req, res) => {
    Users.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Users were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all users."
            });
        });
};
// Find all fabtech users
exports.findAllFabtechs = async (req, res) => {
    Users.findAll({ where: { fabTech: true }, attributes: { exclude: ['password'] } })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving fabTechs."
            });
        });
};