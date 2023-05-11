const {DataTypes} = require("sequelize");

const ContentDetail = (sequelize) => sequelize.define('ContentDetail',{
	content_id: {
		type: DataTypes.UUID,
		primaryKey: true,
		defaultValue: sequelize.literal('uuid_generate_v4()'),
		allowNull: false
	},
	sql: {
		type: DataTypes.TEXT,
		allowNull: true
	},
	schema_version: {
		type: DataTypes.CHAR,
		defaultValue: '1'
	},
	favorite: {
		type: DataTypes.BOOLEAN,
		defaultValue: false
	},
}, {
	schema: 'preference',
	tableName: 'content_detail'
})

module.exports = ContentDetail
