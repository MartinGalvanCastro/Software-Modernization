USERNAME=newuser@example.com
PASSWORD=SuperSecret123!
AWS_REGION=us-east-1
COGNITO_APP_CLIENT_ID=2alun9q1f53bajhtm8g5k2a6mi
COGNITO_USERPOOL_ID=us-east-1_Zwx08CqYK

TOKEN=$(aws cognito-idp initiate-auth \
  --region $AWS_REGION \
  --client-id $COGNITO_APP_CLIENT_ID \
  --auth-flow USER_PASSWORD_AUTH \
  --auth-parameters USERNAME=$USERNAME,PASSWORD=$PASSWORD \
  --query AuthenticationResult.IdToken \
  --output text)

echo $TOKEN
