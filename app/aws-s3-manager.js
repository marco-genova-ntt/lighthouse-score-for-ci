import AWS from 'aws-sdk';
import fs from 'fs';

/**
 * Uploads content on a AWS S3 bucket.
 * 
 * @param {String} bucketName bucket name
 * @param {String} keyName key name for content on AWS S3
 * @param {*} content raw content
 */
export function upload(bucketName, keyName, content, contentType = 'text/html') {

    //created my API set for a Bucket
    const s3 = new AWS.S3({
        apiVersion: '2006-03-01',
        params: {Bucket: bucketName}
    });

    console.info('adding ', keyName, ' to ', bucketName, ' content: ', content);
    var objectParams = {
        Key: keyName,
        Body: content,
        ContentType: contentType,
        ACL: 'public-read'
    };

    var uploadPromise = s3.putObject(objectParams).promise();
    uploadPromise.then(function(data) {
        console.log("Successfully uploaded data to " + bucketName + "/" + keyName);
    }).catch(function(err) {
        console.error(err, err.stack);
    });
}

/**
 * Downloads content from AWS S3 and write it onto file system
 * 
 * @param {String} bucketName bucket name
 * @param {String} keyName key name for content on AWS S3
 * @param {String} fileName file path onto file system
 */
export function downloadFile (bucketName, keyName, fileName) {
    //created my API set for a Bucket
    const s3 = new AWS.S3({
        apiVersion: '2006-03-01',
        params: {Bucket: bucketName}
    });

    console.info('getting ', keyName, ' to ', bucketName, 'written here: ', fileName);
    var objectParams = {
        Key: keyName
    };

    let file = fs.createWriteStream(fileName);
    s3.getObject(objectParams).createReadStream().pipe(file);
}

/**
 * Loads a file from file system and uploads the content.
 * see upload method.
 * 
 * @param {String} bucketName bucket name
 * @param {String} keyName key name for content on AWS S3
 * @param {String} fileName file path onto file system
 */
export function uploadFile (bucketName, keyName, fileName, contentType) {
    fs.readFile(fileName, (err, data) => {
        if (err) throw err;
        upload(bucketName, keyName, data, contentType);
    });
}

/**
 * Gets true if key name exists on the bucket, false otherwise
 * 
 * @param {String} bucketName bucket name
 * @param {String} keyName key name for content on AWS S3
 */
export async function checkExistence(bucketName, keyName) {
    const s3 = new AWS.S3({
        apiVersion: '2006-03-01',
        params: {Bucket: bucketName}
    });

    var objectParams = {
        Key: keyName
    };

    try { 
        const headCode = await s3.headObject(objectParams).promise();
        console.info('got head code ', keyName, ' : ', headCode);
        return true;
    } catch (headErr) {
        if (headErr.code === 'NotFound') {
            return false;
        }

        throw headErr;
    }
}

