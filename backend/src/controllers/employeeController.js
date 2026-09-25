const service = require('../services/employeeService');
const { success, failure } = require('../utils/response');
async function list(req, res, next) { try { return success(res, 'Employees retrieved', await service.list(req.query)); } catch (e) { next(e); } }
async function get(req, res, next) { try { const item = await service.getById(req.params.id); return item ? success(res, 'Employee retrieved', item) : failure(res, 'Employee not found', 'No employee exists with this id', 404); } catch (e) { next(e); } }
async function create(req, res, next) { try { return success(res, 'Employee created', await service.create(req.body), 201); } catch (e) { if (e.number === 2627) return failure(res, 'Employee could not be created', 'Email must be unique', 400); next(e); } }
async function update(req, res, next) { try { const item = await service.update(req.params.id, req.body); return item ? success(res, 'Employee updated', item) : failure(res, 'Employee not found', 'No employee exists with this id', 404); } catch (e) { if (e.number === 2627) return failure(res, 'Employee could not be updated', 'Email must be unique', 400); next(e); } }
async function remove(req, res, next) { try { return await service.remove(req.params.id) ? success(res, 'Employee deleted', null) : failure(res, 'Employee not found', 'No employee exists with this id', 404); } catch (e) { next(e); } }
async function dashboard(req, res, next) { try { return success(res, 'Dashboard retrieved', await service.dashboard()); } catch (e) { next(e); } }
async function report(req, res, next) { try { return success(res, 'Report generated', await service.report(req.query.status)); } catch (e) { next(e); } }
module.exports = { list, get, create, update, remove, dashboard, report };
