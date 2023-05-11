const {DataTypes} = require("sequelize");
const UserContent = (sequelize) => sequelize.define('UserContent', {
	id: {
		type: DataTypes.UUID,
		primaryKey: true,
		defaultValue: sequelize.literal('uuid_generate_v4()'),
		allowNull: false
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false
	},
	description: {
		type: DataTypes.STRING,
		allowNull: true
	},
	type: {
		type: DataTypes.ENUM,
		values: ['sql', 'report', 'log_sql'],
		allowNull: false
	},
	visibility: {
		type: DataTypes.ENUM,
		values: ['user', 'project', 'org', 'public'],
		defaultValue: 'user'
	},
	owner_id: DataTypes.UUID, // user id
	inserted_at: {
		type: DataTypes.DATE,
		defaultValue: sequelize.literal(`timezone('utc'::text, now())`)
	},
	updated_at: {
		type: DataTypes.DATE,
		defaultValue:  sequelize.literal(`timezone('utc'::text, now())`)
	},
}, {
	schema: 'preference',
	tableName: 'user_content'
})

module.exports = UserContent
