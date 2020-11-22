const fs = require('fs')
const path = require('path')

module.exports = function setupAddingTimeReceived(bot) {
    bot.use((ctx, next) => {
        ctx.timeReceived = new Date()
        next()

        if (ctx.update.message && ctx.update.message.date) {
            const nowInSeconds = Math.floor(Date.now() / 1000)
            const logDir = process.env.UPDATES_LOG_DIR ? path.join(process.env.UPDATES_LOG_DIR, 'updates.log') : path.normalize(`${__dirname}/../updates.log`)
            fs.appendFile(logDir, `\n${nowInSeconds} — ${ctx.update.update_id} — ${nowInSeconds - ctx.update.message.date}s`, (err) => {
                if (err) {
                    // eslint-disable-next-line no-console
                    console.error(err)
                }
            });
        }
    })
}
