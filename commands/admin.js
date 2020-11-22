// Dependencies
const fs = require('fs')
const yaml = require('js-yaml')
const logAnswerTime = require('../helpers/logAnswerTime')
const { languageMaps } = require('../helpers/language/languageConstants')

function checkIfSuperAdmin(ctx, next) {
    if (ctx.from.id === parseInt(process.env.ADMIN_ID, 10)) {
        next()
    }
}

function setupAdmin(bot) {
    bot.command('checkTranslations', checkIfSuperAdmin, ctx => {
        handleCheckTranslations(ctx)
    })
    bot.command('checkTranslation', checkIfSuperAdmin, ctx => {
        handleCheckTranslation(ctx)
    })
}

async function handleCheckTranslations(ctx) {
    // Get locales
    let allLocales = []
    for (const localeMap of Object.values(languageMaps)) {
        for (const locale of Object.values(localeMap)) {
            if (!allLocales.includes(locale)) {
                allLocales.push(locale)
            }
        }
    }
    allLocales = allLocales.filter(l => fs.existsSync(`${__dirname}/../locales/${l}.yaml`))
    // Check locales
    for (const locale of allLocales) {
        // eslint-disable-next-line no-await-in-loop
        await handleCheckTranslation(ctx, locale)
        // eslint-disable-next-line no-await-in-loop
        await delay(1)
    }
    // Log answer
    logAnswerTime(ctx, '/checkTranslations')
}

async function handleCheckTranslation(ctx, locale) {
    if (!locale) {
        locale = ctx.message.text.substring(18).trim()
    }
    // set locale
    ctx.i18n.locale(locale || 'en')
    // Check all the strings
    const doc = yaml.safeLoad(
        fs.readFileSync(`${__dirname}/../locales/en.yaml`, 'utf8')
    )
    for (const key of Object.keys(doc)) {
        try {
            // eslint-disable-next-line no-await-in-loop
            await ctx.replyWithMarkdown(ctx.i18n.t(key), {
                parse_mode: 'Markdown',
            })
        } catch (err) {
            // eslint-disable-next-line no-await-in-loop
            await ctx.reply(`Error (${locale}, ${key}): ${err.message || err}`)
            console.info(`Error (${locale}, ${key}): ${err.message || err}`)
        }
    }
    // Log success
    await ctx.reply(`${locale} test finished`)
    console.info(`${locale} test finished`)
}

function delay(s) {
    return new Promise(res => {
        setTimeout(() => {
            res()
        }, s * 1000)
    })
}

// Exports
module.exports = setupAdmin
