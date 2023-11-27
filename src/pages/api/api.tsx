module.exports = {
    async rewrites(){
        return[
            {
                source: '/api/:slug*',
                destiation:'<http://localhost:5000/:slug*>'
            },
        ]
    },
}