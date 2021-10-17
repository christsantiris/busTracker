const serviceConfig = {
    port: process.env.PORT || 4000,
    envName: process.env.ENV_NAME || 'local'
}

export { serviceConfig };