USERNAME=testuser@example.com
PASSWORD=P@ssw0rd123!
AWS_REGION=us-east-1
COGNITO_APP_CLIENT_ID=1psr821qe4k7hl7aa0rsjo007h

TOKEN=$(aws cognito-idp initiate-auth \
  --region $AWS_REGION \
  --client-id $COGNITO_APP_CLIENT_ID \
  --auth-flow USER_PASSWORD_AUTH \
  --auth-parameters USERNAME=$USERNAME,PASSWORD=$PASSWORD \
  --query AuthenticationResult.IdToken \
  --output text)

echo $TOKEN
