'use strict';

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Todo extends Model {
        static associate(models) {
            Todo.belongsTo(models.User, {
                foreignKey: 'UserId',
                as: 'user'
            });
        }
    }

    Todo.init({
        title: DataTypes.STRING,
        completed: DataTypes.BOOLEAN,
        UserId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: sequelize.literal('NOW()')
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: sequelize.literal('NOW()')
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        sequelize,
        modelName: 'Todo'
    });

    return Todo;
};
