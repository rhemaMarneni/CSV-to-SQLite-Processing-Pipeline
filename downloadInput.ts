/**
 * Helper function for input file processing - stream processing
    * existing tmp/ and out/ are replaced
    * download input file as .tar.gz
    * decompress into .tar
    * extract /dump
    * handles errors effectively
 */

import fs from 'fs';
import https from 'https';
import zlib from 'zlib';
import tar from 'tar';
import path from 'path';

//function to create necessary directories - /tmp and /out
export const createDirectory = (directory: string) => {
    if (fs.existsSync(directory)) {
        fs.rmSync(directory, { recursive: true, force: true });
        console.log(`${directory} directory deleted`);
    }
    fs.mkdirSync(directory, { recursive: true });
    console.log(`${directory} directory created`);
};

//function for downloading, decompressing and extracting input data
export const processInput = (fileUrl: string, outputDirectory: string, outputFile: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        try {
            //create /tmp
            createDirectory(outputDirectory);
            const file = fs.createWriteStream(outputFile);
            //downloading file
            https.get(fileUrl, (response) => {
                response.pipe(file);
                file.on('finish', () => {
                    file.close(async () => {
                        console.log('Input File downloaded successfully');
                        const compressedFilePath = path.join(outputDirectory, 'downloaded_file.tar.gz');
                        const decompressedFilePath = path.join(outputDirectory, 'decompressed_file.tar');
                        const decompressedFile = fs.createWriteStream(decompressedFilePath);
                        const gunzip = zlib.createGunzip();
                        console.log("Decompressing .gz file");
                        //decompressing file
                        fs.createReadStream(compressedFilePath)
                            .pipe(gunzip)
                            .pipe(decompressedFile)
                            .on('finish', () => {
                                console.log("Extracting .tar data");
                                //extracting "dump" folder
                                fs.createReadStream(decompressedFilePath)
                                    .pipe(tar.extract({ cwd: outputDirectory }))
                                    .on('finish', () => {
                                        console.log(`Input Files extracted successfully to ${outputDirectory}`);
                                        resolve(); // Resolve -> everything is done
                                    })
                                    .on('error', (err: Error) => {
                                        console.error('Error during extraction:', err);
                                        reject(err); // Reject the promise -> extraction error
                                    });
                            })
                            .on('error', (err: Error) => {
                                console.error('Error during decompression:', err);
                                reject(err); // Reject the promise -> decompression error
                            });

                        decompressedFile.on('error', (err: Error) => {
                            console.error('Error creating decompressed file:', err);
                            reject(err); // Reject the promise -> error with the decompressed file stream
                        });
                    });
                }).on('error', (err: Error) => {
                    fs.rmSync(outputDirectory, { recursive: true, force: true }); // download error
                    console.error('Error downloading file:', err);
                    reject(err); // Reject the promise -> download error
                });
            }).on('error', (err: Error) => {
                fs.rmSync(outputDirectory, { recursive: true, force: true }); // network error
                console.error('Error with HTTP request:', err);
                reject(err); // Reject the promise if there's an HTTP request error
            });
        } catch (err) {
            console.error('Error during file download and extraction process:', err);
            reject(err); // Reject the promise-> synchronous error
        }
    });
};