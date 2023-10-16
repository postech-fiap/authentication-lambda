const jwt = require('jsonwebtoken')

const key = 'private-key'

const generateRandomToken = () => {
    const payload = {
        anonymous: true
    }
    return jwt.sign(payload, key)
}

const generateToken = (cpf) => {
    const payload = { cpf }
    return jwt.sign(payload, key)
}

const makeSuccessResponse = (token) => {
    return {
        statusCode: 200,
        body: {
            token
        }
      }
}

const makeErrorResponse = () => {
    return {
        statusCode: 500
      }
}

exports.handler = async function(event, context) {
    const cpf = event?.cpf

    if (cpf == null) {
        const randomToken = generateRandomToken()
        return makeSuccessResponse(randomToken)
    }

    const token = generateToken(cpf)

    return makeSuccessResponse(token)
}
