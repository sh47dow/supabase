import * as constants from '../utils/constants.js'
import * as postgres from '../utils/postgres.js'

var fs = require('fs')
var path = require('path')
var getAllSql = fs.readFileSync(path.join(__dirname, '../sql/getAllPLugins.sql')).toString()

/**
 * Queries a given schema for all the tables
 * @param {Object} config The database config
 * @param {Object} config The database config
 * @param {string} config.host
 * @param {string} config.user
 * @param {string} config.password
 * @param {string} config.database
 * @param {number} config.port
 *
 * @example
 * await getAll()
 * //=>
 * [
 *    { name: 'plpgsql', version: '1.0', schema: 'pg_catalog', description: 'PL/pgSQL procedural language' }
 * ]
 */
export const getAll = async (config = {}, options = {}) => {
  const dbConfig = { ...constants.POSTGRES_CONFIG, ...config }
  const conn = await postgres.connect(dbConfig)
  const results = await postgres.runQuery(conn, getAllSql)
  postgres.disconnect(conn)
  return results.rows
}
