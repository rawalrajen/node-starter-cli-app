import http from 'http'; // or 'https' for https:// URLs
import fs from 'fs';
import { URL } from 'url';


export const download = (url: string | URL | http.RequestOptions, dest: fs.PathLike) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest, { flags: "wx" });

        const request = http.get(url, response => {
            if (response.statusCode === 200) {
                response.pipe(file);
            } else {
                file.close();
                fs.unlink(dest, () => { }); // Delete temp file
                reject(`Server responded with ${response.statusCode}: ${response.statusMessage}`);
            }
        });

        request.on("error", err => {
            file.close();
            fs.unlink(dest, () => { }); // Delete temp file
            reject(err.message);
        });

        file.on("finish", () => {
            resolve({ filePath: dest });
        });

        file.on("error", err => {
            file.close();
            fs.unlink(dest, () => { }); // Delete temp file
            reject(err.message);
        });
    });
}


