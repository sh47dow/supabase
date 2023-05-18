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
	period_start_time_period: {
		type: DataTypes.ENUM('0m', '1m', '5m', '1h', '1d', '1w', '1M', '1y'),
		allowNull: true
	},
	period_start_date: {
		type: DataTypes.DATE,
		allowNull: true
	},
	period_end_time_period: {
		type: DataTypes.ENUM('0m', '1m ', '5m', '1h', '1d', '1w', '1M', '1y'),
		allowNull: true
	},
	period_end_date: {
		type: DataTypes.DATE,
		allowNull: true
	},
	interval: {
		type: DataTypes.ENUM('1m', '5m', '1h', '1d', '1w', '1M', '1y'),
		allowNull: true
	},
	layout: {
		type: DataTypes.ARRAY(DataTypes.JSONB),
		defaultValue: [],
		allowNull: true
	}
}, {
	schema: 'preference',
	tableName: 'content_detail',
	timestamps: false
})

module.exports = ContentDetail
