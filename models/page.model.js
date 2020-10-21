module.exports = (sequelize, Sequelize) => {
    const Page = sequelize.define("page", {
        title: {
            type: Sequelize.STRING
        },
        metadata: {
            type: Sequelize.TEXT
        },
        body: {
            type: Sequelize.TEXT
        }
    });
    
    return Page;
};