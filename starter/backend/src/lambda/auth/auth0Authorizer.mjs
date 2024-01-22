// import Axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')

// const jwksUrl =
// ;('https://dev-shyd7mw3y7ioml1w.us.auth0.com/.well-known/jwks.json')

const certificate = `-----BEGIN CERTIFICATE-----
MIIDHTCCAgWgAwIBAgIJcwhP526N4b8TMA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNV
BAMTIWRldi1zaHlkN213M3k3aW9tbDF3LnVzLmF1dGgwLmNvbTAeFw0yNDAxMTkx
MDAyNTlaFw0zNzA5MjcxMDAyNTlaMCwxKjAoBgNVBAMTIWRldi1zaHlkN213M3k3
aW9tbDF3LnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
ggEBAPSTcftKEZBwDK6uDTLtDd5KiBFXKaW+GSUFpOIBmACQuIsxjpHSOujLwt32
yYZwoGC0fNxZFYT/pDGGMI63iEezwXg7T9inunVOziLDg+EgAI0VVi7wRtnJOUeR
hU5EXuRsjDC/7ukRqEl7VAMYvJC6F0McAqZ0+lNbwpU2/Y0MWkpWMCuJW70E790c
mfs7lYEcT/OnOUUx0MjGQs5KFNo9HpDg9VuF7Fh/1kUG1/2cnlihVo/8Y7GEJWvJ
/5bD5DXfR3U22gF6jA4cckfXKj1yZJ33vU+5o547zqZBKrw1Fj15K+g9A1dnHNsu
VPEtCbDx2LASsCVRf2ClPNYGg/MCAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAd
BgNVHQ4EFgQUiMXnFHyAwbNyoy0l5mGGlmXxdycwDgYDVR0PAQH/BAQDAgKEMA0G
CSqGSIb3DQEBCwUAA4IBAQBw5X0qbVxlRrAsbnuaqgRvuiQsB/Q/SCIqBSVkiWBe
gDiwwtNezHAJOqpl7/rxZuK53UXisq6fm4OdJvaQJUSzT+GRzrctfWlo7dFIz2lg
c891Fu318905TjcyEKpbPjpCETiYHrqFv7jCKLfw+YoXj0Gy0xvvzFsYsJihXN/e
U7758p3gHuuqhj3KxWWn3C9okToKVpuzaWHHpapdO+eqqxhtYr3nTsS1VnTrUPIL
fXpL0Ryw6dAa6ohPm3xMdv24VeQD38GYsbUxnLW5FPsvL67yrODAAS2Jxc6qohxZ
FLBVy1Rgb9krqQ92N9lBM53Ctxxo1VhHHybmK0e4ARhu
-----END CERTIFICATE-----`

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  logger.info('verifying Token', authHeader.substring(0, 20))
  const token = getToken(authHeader)
  // const jwt = jsonwebtoken.decode(token, { complete: true })

  // const response = await Axios.get(jwksUrl)
  // const keys = response.data.keys
  // const signingKeys = keys.find((key) => key.kid === jwt.header.kid)
  // logger.info('signingKeys', signingKeys)
  // if (!signingKeys) {
  //   throw new Error('Keys is invalid')
  // }

  jsonwebtoken.verify(token, certificate, { algorithms: ['RS256'] })
  logger.info('verifyToken', verifyToken)
  return verifyToken
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
