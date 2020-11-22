module.exports = function engineString(engine) {
    if (engine === 'wit') {
        return 'Wit.ai'
    }
    return 'Google Speech'
}
