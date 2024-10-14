module.exports = function () {
    return {
        files: [
            'src/**/*.js'
        ],

        tests: [
            'unit-tests/**/*.spec.js'
        ],
        env: {
            type: 'node',
            runner: 'node',
        },
        workers: {
            recycle: true,
            initial: 1,
            regular: 1,
        },
    };
};
