const archiver = require('archiver');
const { exec } = require('child_process');
const path = require('path');

function backup(req, res) {
    const { dbName } = req.query;
    const mongoURI = dbName;
    exec(`mongodump --uri ${mongoURI}`, (error, stdout, stderr) => {
        if (error) {
            console.log(`Error while running mongodump: ${error}`);
            res.status(500).send({ status: 'Backup failed', error: error, stdout: stdout });
            return;
        }

        const archive = archiver('zip', {
            zlib: { level: 9 },
        });
        archive.pipe(res);

        archive.directory('dump', false);

        res.attachment('dump.zip');
        archive.finalize();
    });
}

function restore(req, res) {
    const mongorestorePath = 'mongorestore --uri ';
    const dumpDirectory = path.join(__dirname, '../../dump');
    console.log("dumpDirectory",dumpDirectory)
    const dbName = req.query.dbName;

    if (!dbName) {
        return res.status(400).json({ error: 'Missing dbName parameter in the query.' });
    }

    const command = `${mongorestorePath} ${dbName} ${dumpDirectory}`;
    console.log(command)

    exec(command, (error, stdout, stderr) => {
        if (error) {
            res.status(500).json({ error: error.message });
        } else {
            res.json({ message: 'MongoDB dump restored successfully' });
        }
    });
}

module.exports = {
    backup,
    restore
};
