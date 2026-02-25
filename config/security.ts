export default {
  config: {
    contentSecurityPolicy: false,
    xssFilter: false,
    frameguard: false,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
    },
    selectOptions: {

    },
  },
};