const ResponseHandlers = {
  returnData,
}

module.exports = ResponseHandlers

function returnData(res, data) {
  const response = data ? data : { message: 'Not found' }
  return res.status(200).json(response)
}
