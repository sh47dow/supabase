const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();
const sequelize = new Sequelize(`postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`);

async function initDn() {
	// prefercence的schema创建
	const schemas = await sequelize.showAllSchemas( {logging: false} )
	const schemaExists = schemas.includes('preference')

	if (!schemaExists) {
		try {
			await sequelize.createSchema('preference')
			console.log('创建preference成功')
		} catch (e) {
			console.log('创建preference时，出现了错误', e)
		}
	}

	const ContentDetail = require('./db-modal/user-detail')(sequelize)
	const UserContent = require('./db-modal/user-content')(sequelize)

	UserContent.belongsTo(ContentDetail, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
		as : 'content',
		foreignKey: {
			name: 'content_id',
			allowNull: false,
			type: DataTypes.UUID,
		},
		hooks: true
	});

	ContentDetail.hasOne(UserContent, {
		onDelete: 'RESTRICT',
		onUpdate: 'RESTRICT',
		foreignKey: 'content_id'
	})

	await sequelize.sync({alter: true})
	await sequelize.close()
}

initDn().then(() => console.log('创建或更新preference下的数据表：已完成同步'))
