//Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Customer API',
            description: 'Customer API information',
            contact: {
                name: "Code project"
            },
            servers: ["http://localhost:5000"]
        }
    },
    apis: ["../routes/*.js"]
}

module.exports = swaggerOptions;