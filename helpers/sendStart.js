// Dependencies
const logAnswerTime = require('./logAnswerTime')

module.exports = async function sendStart(ctx) {
    await ctx.replyWithMarkdown(ctx.i18n.t('start'))
    logAnswerTime(ctx, '/start')
}
