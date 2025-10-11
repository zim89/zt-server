export const authMessages = {
  user: {
    error: {
      alreadyExists: 'User with this email already exists',
      notFound: 'User not found',
      notFoundOrInactive: 'User not found or inactive',
      notAuthenticated: 'User not authenticated',
      accountNotActive: 'Account is not active',
      invalidCredentials: 'Invalid email or password',
      idMissingOrInvalid: 'User ID is missing or invalid',
    },
    success: {},
  },
  token: {
    error: {
      invalid: 'Invalid token or user not found',
      invalidOrExpired: 'Invalid or expired token',
      refreshTokenMissing: 'Refresh token is missing',
    },
    success: {},
  },
  session: {
    error: {},
    success: {
      loggedOut: 'Successfully logged out',
      loggedOutAllDevices: 'Successfully logged out from all devices',
    },
  },
} as const;
