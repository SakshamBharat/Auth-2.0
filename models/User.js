import { DataTypes }  from "@sequelize/core";
import sequelize  from "../config/database.js";



const User = sequelize.define(

    "User",
    {

        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
       uuid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    unique: true,
},

        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        }, 
         otp_number:{
            type: DataTypes.STRING,
            defaultValue:"0",
        },
        otp_verify:{
            type: DataTypes.BOOLEAN,
            defaultValue:false,
        }




    }, {
    tableName: "users",
    timestamps: true,
}







)
    ;
export default User;