import AWS from 'aws-sdk';
import fs from 'fs';

/**
 * Uploads content on a AWS S3 bucket.
 * 
 * @param {String} bucketName bucket name
 * @param {String} keyName key name for content on AWS S3
 * @param {*} content raw content
 */
export function upload(bucketName, keyName, content) {

    //created my API set for a Bucket
    const s3 = new AWS.S3({
        apiVersion: '2006-03-01',
        params: {Bucket: bucketName}
    });

    console.info('adding %s to %s', keyName. bucketName);
    var objectParams = {
        Key: keyName,
        Body: content,
        ContentType: "text/html",
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
 * Loads a file from file system and uploads the content.
 * see upload method.
 * 
 * @param {String} bucketName bucket name
 * @param {String} keyName key name for content on AWS S3
 * @param {String} fileName 
 */
export function uploadFile (bucketName, keyName, fileName) {

    fs.readFile(fileName, (err, data) => {
        if (err) throw err;
        upload(bucketName, keyName, data);
    });
}



