// Dependencies
const { Lock } = require('semaphore-async-await')
const cluster = require('cluster')
const numCPUs = require('os').cpus().length
const uuid = require('uuid')
const download = require('download')
const temp = require('temp')
const fs = require('fs')
const speechAPI = require('./speechAPI')
const flac = require('./flac')
const { report } = require('./report')
const tryDeletingFile = require('./deleteFile')

// Generate cluster workers
const workers = []
if (cluster.isMaster) {
    console.info(`Master ${process.pid} is running`)
    for (let i = 0; i < numCPUs; i += 1) {
        const worker = cluster.fork()
        worker.on('message', masterReceivesMessage)
        workers.push(worker)
    }
} else {
    console.info(`Worker ${process.pid} started`)
    process.on('message', workerReceivesMessage)
}

// Called only from the master
const recognitionPromises = {}
let clusterNumber = 0

async function urlToText(url, chat) {
    // Obtain worker synchronously
    const lock = new Lock(1)
    await lock.acquire()
    if (clusterNumber >= workers.length) {
        clusterNumber = 0
    }
    const worker = workers[clusterNumber]
    clusterNumber += 1
    lock.release()
    // Create promise and send the message to worker
    return new Promise((res, rej) => {
        const promiseId = uuid.v4()
        recognitionPromises[promiseId] = { res, rej }
        worker.send({ url, promiseId, chat })
    })
}

async function workerReceivesMessage({ url, promiseId, chat }) {
    try {
        const result = await convert(url, chat)
        process.send({ ...result, promiseId })
    } catch (error) {
        process.send({ error: error.message, promiseId })
    }
}

function masterReceivesMessage({
                                   textWithTimecodes,
                                   duration,
                                   promiseId,
                                   error,
                               }) {
    // Get promise functions
    const promiseFunctions = recognitionPromises[promiseId]
    // Log message received
    if (error) {
        if (promiseFunctions) {
            promiseFunctions.rej(new Error(error))
        }
    } else if (promiseFunctions) {
        promiseFunctions.res({ textWithTimecodes, duration })
    }
}

async function convert(url, chat) {
    // Download audio file
    const ogaPath = temp.path({ suffix: '.oga' })
    try {
        const data = await download(url)
        fs.writeFileSync(ogaPath, data)
    } catch (err) {
        tryDeletingFile(ogaPath)
        report(undefined, err, 'sendTranscription.downloadAudioFile')
        throw err
    }
    // Convert audio file to flac
    let flacPath
    let duration
    try {
        const result = await flac(ogaPath)
        flacPath = result.flacPath
        duration = result.duration
    } catch (err) {
        tryDeletingFile(ogaPath)
        report(undefined, err, 'sendTranscription.convertAudioFile')
        throw err
    }

    // Convert flac file to speech
    try {
        // Get transcription
        const textWithTimecodes = await speechAPI.getText(
            flacPath,
            chat,
            duration,
            ogaPath
        )
        // Return result
        return {
            textWithTimecodes,
            duration,
        }
    } catch (err) {
        report(undefined, err, 'sendTranscription.convertFlacToText')
        throw err
    } finally {
        tryDeletingFile(flacPath)
        // No need for oga file anymore
        tryDeletingFile(ogaPath)
    }
}

module.exports = urlToText
