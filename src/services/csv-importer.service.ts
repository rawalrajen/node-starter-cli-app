import fs from 'fs';
import { parse } from 'fast-csv';
import { Transaction } from '../db';
import { DateTime } from 'luxon';
import { download } from './file-downloader.service';
const MAX_ROWS_TO_IMPORT = 1000;

import * as config from '../configs/index.config'
import AdmZip from "adm-zip";

export const importAndProcess = async () => {
    let rows = [];
    const filePath = await downloadFile()
    await extractFile(filePath);

    fs.createReadStream(filePath)
        .pipe(parse({ headers: true, maxRows: MAX_ROWS_TO_IMPORT }))
        .on('error', error => console.error(error))
        .on('data', row => {
            const transaction = new Transaction(row);
            transaction.transaction_date = DateTime
                .fromSeconds(parseInt(row.timestamp))
                .toFormat('yyyy-MM-dd');

            transaction.save();
            console.log(transaction);
            rows.push(row);
        })
        .on('end', (rowCount: number) => {
            console.log(`Parsed ${rowCount} rows`);
            process.exit();
        });
}

const downloadFile = async () => {
    const downloadPath = './assets'
    try {
        if (!fs.existsSync(downloadPath)) {
            fs.mkdirSync(downloadPath);
        }
        const fileName = `${downloadPath}/${new Date().getTime()}_transactions.csv.zip`;

        await download(config.default.remoteFileUrl, fileName);

        console.log("=======File Downloaded=========", fileName);

        return fileName;

    } catch (err) {
        console.log(err);
    }
}

const extractFile = async (fileName: any) => {
    try {
        const zip = new AdmZip(fileName);

        await zip.extractAllTo(__dirname, true);

        console.log("=======File Extracted=========", fileName);

        return fileName;
    } catch (err) {
        console.log(err);
    }
}