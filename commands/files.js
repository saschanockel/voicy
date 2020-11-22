// Dependencies
const logAnswerTime = require('../helpers/logAnswerTime')
const checkAdminLock = require('../middlewares/adminLock')

function setupFiles(bot) {
    bot.command('files', checkAdminLock, async ctx => {
        handle(ctx)
    })
}

async function handle(ctx) {
    // Reverse files field
    ctx.dbchat.filesBanned = !ctx.dbchat.filesBanned
    // Save chat
    ctx.dbchat = await ctx.dbchat.save()
    // Reply with the new setting
    await ctx.replyWithMarkdown(
        ctx.i18n.t(ctx.dbchat.filesBanned ? 'files_false' : 'files_true')
    )
    // Log time
    logAnswerTime(ctx, '/files')
}

// Exports
module.exports = setupFiles
