module.exports = (sequelize,Sequelize)=>{
    const Machine = sequelize.define("machine",{
        name: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.BOOLEAN
        },
        description: {
            type: Sequelize.STRING
        },
        requiredTraining: {
            type: Sequelize.STRING
        },
        taggedOut: {
            type: Sequelize.BOOLEAN
        },
        group:{
            type: Sequelize.STRING
        }

    })
    return Machine;
};