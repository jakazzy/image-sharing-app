import { CustomAuthorizerHandler, CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

// import { verify } from 'jsonwebtoken'
// import { JwtToken } from '../../auth/JwtToken'

export const handler: CustomAuthorizerHandler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
    console.log('Event from authorization: ', event)
    const value = event.authorizationToken.split(' ')
    console.log('type of token: ', value[1],' ', typeof value[1] )
    try{
        verifyToken(event.authorizationToken)
        console.log('User was authorized')

        return {
            principalId: 'user',
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
          console.log('User was not authorized', e.message)
      
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

function verifyToken(authHeader: string) {
    if (!authHeader)
      throw new Error('No authentication header')
  
    if (!authHeader.toLocaleLowerCase().startsWith('bearer '))
      throw new Error('Invalid authentication header')
  
    const split = authHeader.split(' ')
    const token = split[1]

    console.log('type of token: ', typeof token)
    if (token !== '123')
      throw new Error('invalid token')
   
  }
