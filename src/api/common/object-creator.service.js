const CONFIG = require('../../config')

/**
 * @type {{createHistoryObject: ((function(*=): ({regno: string|*, workshop_name: string|*, signature: *, invoice_no: string|*, mechanic: string|*, customer_phone: string|*, dist: string|*, id: *, text: *, order_type: string|*, invoice_date: string|*, mileage: string|*}|null))|*), createWebOrderObject: ((function(*=): ({zip: *, workshop_id: {zip: *, city: *, customer_number: *, facebook, county: *, dist: string|*, active: *, free_text, workshop_number: *, long: *, phone: string|string|*, street: *, name: *, id: *, wholesaler: *, slug: *, lat: *, email: *, homepage, apps: *}|null, request: *, city: *, created: *, dist: string|*, last_name: *, message: *, duration: *, phone: string|string|*, street: *, name: *, id: *, housenr: *, first_name: *}|null))|*), createAppObject: (function(*): {name: *, active: *, id: *}), createVehicleObject: ((function(*=): ({regno: string|*, mob_expiry_date, next_service_date, next_pkk_date, id: *, next_work_date}|null))|*), createImageObject: (function(*, *): string)}}
 */
const ObjectCreatorService = {
  createVehicleObject,
  createHistoryObject,
  createImageObject,
  createAppObject,
  createWebOrderObject,
}

module.exports = ObjectCreatorService

function createVehicleObject(result) {
  if (result) {
    return {
      id: result._id,
      regno: result.regno,
      mob_expiry_date: result.mob_expiry_date || null,
      next_pkk_date: result.next_pkk_date || null,
      next_work_date: result.next_work_date || null,
      next_service_date: result.next_service_date || null,
    }
  }

  return null
}

function createHistoryObject(result) {
  if (result) {
    return {
      id: result._id,
      text: result.text,
      dist: result.dist,
      invoice_date: result.invoice_date,
      invoice_no: result.invoice_no,
      mechanic: result.mechanic,
      mileage: result.mileage,
      order_type: result.order_type,
      signature: result.signature,
      regno: result.regno,
      customer_phone: result.customer_phone,
      workshop_name: result.workshop_name,
    }
  }

  return null
}

function createWorkshopObject(result) {
  if (result) {
    return {
      id: result._id,
      dist: result.dist,
      name: result.name,
      slug: result.slug,
      street: result.street,
      zip: result.zip,
      city: result.city,
      county: result.county,
      lat: result.lat,
      long: result.long,
      email: result.email,
      phone: result.phone,
      facebook: result.facebook || null,
      homepage: result.homepage || null,
      free_text: result.free_text || null,
      active: result.active,
      wholesaler: result.wholesaler,
      customer_number: result.customer_number,
      workshop_number: result.workshop_number,
      apps: result.apps,
    }
  }

  return null
}

function createImageObject(entityId, result) {
  return `https://s3.${CONFIG.S3_REGION}.amazonaws.com/${CONFIG.S3_BUCKET_NAME}/${result.Key}`
}

function createAppObject(result) {
  return {
    id: result._id,
    name: result.name,
    active: result.active,
  }
}

function createWebOrderObject(data) {
  if (data) {
    return {
      id: data._id,
      dist: data.dist,
      first_name: data.first_name,
      last_name: data.last_name,
      phone: data.phone,
      street: data.street,
      housenr: data.housenr,
      zip: data.zip,
      city: data.city,
      workshop_id: createWorkshopObject(data.workshop),
      request: data.request,
      message: data.message,
      name: data.order_type_name,
      duration: data.order_type_duration,
      created: data.createdAt,
    }
  }

  return null
}
