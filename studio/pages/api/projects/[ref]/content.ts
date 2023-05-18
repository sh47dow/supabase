import { NextApiRequest, NextApiResponse } from 'next'
import apiWrapper from 'lib/api/apiWrapper'
import {Sequelize} from "sequelize";
import {isUndefined} from "lodash";
import {IS_OFFLINE} from "../../../../lib/constants";


const sequelize = new Sequelize(`postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`);
const UserContent = require('../../../../db-modal/user-content')(sequelize);
const ContentDetail = require('../../../../db-modal/user-detail')(sequelize);

UserContent.belongsTo(ContentDetail, {
  as: 'content',
  foreignKey: 'content_id',
  onDelete: 'CASCADE',
  hooks: true,
});

ContentDetail.hasOne(UserContent, {
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
  foreignKey: 'content_id'
})

export default (req: NextApiRequest, res: NextApiResponse) => apiWrapper(req, res, handler)

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  switch (method) {
    case 'GET':
      return handleGetAll(req, res)
    case 'POST':
      return handlePost(req, res)
    case 'PATCH':
      return handlePatch(req, res)
    case 'DELETE':
      return handleDelete(req, res)
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PATCH'])
      res.status(405).json({ data: null, error: { message: `Method ${method} Not Allowed` } })
  }
}

const handleGetAll = async (req: NextApiRequest, res: NextApiResponse) => {
  // if (IS_OFFLINE) {
  //   return res.status(200).json({ data: []})
  // }
  try {
    const contents = await UserContent.findAll({
      include: {
        model: ContentDetail,
        as: 'content'
      }
    })
    return res.status(200).json({ data: contents})
  } catch (e) {
    return res.status(400).json({ error: e})
  }
}

const handlePost = async (req: NextApiRequest, res: NextApiResponse) => {
  // if (IS_OFFLINE) {
  //   return res.status(200).json({ data: req.body})
  // }
  try {
    const payload = req.body
    if (isUndefined(payload)) {
      throw 'invalid payload'
    }
    payload.owner_id = process.env.USER_ID
    const content = await ContentDetail.create(payload.content)
    delete payload.content
    const data = await UserContent.create({...payload, content_id: content.content_id})
    return res.status(200).json({data})
  } catch (e) {
    return res.status(400).json({error: e})
  }
}

const handlePatch = async (req: NextApiRequest, res: NextApiResponse) => {
  // if (IS_OFFLINE) {
  //   return res.status(200).json({ data: req.body})
  // }
  try {
    const payload = req.body
    if (isUndefined(payload)) {
      throw 'invalid payload'
    }
    if (payload.content) {
      const userContent = await UserContent.findByPk(payload.id)
      const data = await ContentDetail.update({
        ...payload.content
      }, {
        where: { content_id: userContent.content_id }
      })
      return res.status(200).json({data})
    } else {
      const data = await UserContent.update(payload, {
        where: {id: payload.id}
      })
      return res.status(200).json({data})
    }
  } catch (e) {
    return res.status(400).json({error: e})
  }
}

const handleDelete = async (req: NextApiRequest, res: NextApiResponse) => {
  // if (IS_OFFLINE) {
  //   return res.status(200).json({})
  // }
  try {
    const content = await UserContent.findByPk(req.query.id)
    const data = content.destroy()
    return res.status(200).json({data})
  } catch (e) {
    return res.status(400).json({error: e})
  }

}
