export const env = {
  facebookApi: {
    clientId: process.env.FACEBOOK_CLIENT_ID ?? '1803485194161920',
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET ??   '57f94f4a709da8b4a8dc0e1b3d68d6f7'
  },
  port: process.env.PORT ?? 8080,
  jwtSecret: process.env.JWT_SECRET ?? '8YAdANGeU91dLIehbtYXG4mCumzGzR/M7cWmT+QSzOwg88Ink3MYwPsBq2sEqUtOVxCuxLoHTVvk7hKSaRU7pg=='
}