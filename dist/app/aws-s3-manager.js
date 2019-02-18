"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.upload = upload;
exports.downloadFile = downloadFile;
exports.uploadFile = uploadFile;
exports.checkExistence = checkExistence;

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Uploads content on a AWS S3 bucket.
 * 
 * @param {String} bucketName bucket name
 * @param {String} keyName key name for content on AWS S3
 * @param {*} content raw content
 */
function upload(bucketName, keyName, content, contentType = 'text/html') {
  //created my API set for a Bucket
  const s3 = new _awsSdk.default.S3({
    apiVersion: '2006-03-01',
    params: {
      Bucket: bucketName
    }
  });
  console.info('adding ', keyName, ' to ', bucketName);
  var objectParams = {
    Key: keyName,
    Body: content,
    ContentType: contentType,
    ACL: 'public-read'
  };
  var uploadPromise = s3.putObject(objectParams).promise();
  uploadPromise.then(function (data) {
    console.info("Successfully uploaded data to ", bucketName, "/", keyName);
  }).catch(function (err) {
    console.error(err, err.stack);
  });
}
/**
 * Downloads content from AWS S3 and write it onto file system
 * 
 * @param {String} bucketName bucket name
 * @param {String} keyName key name for content on AWS S3
 * @param {String} fileName file path onto file system
 * @param {function} callback function called at the end of writing
 */


async function downloadFile(bucketName, keyName, fileName, callBack) {
  //created my API set for a Bucket
  const s3 = new _awsSdk.default.S3({
    apiVersion: '2006-03-01',
    params: {
      Bucket: bucketName
    }
  });
  console.info('getting ', keyName, ' to ', bucketName, 'written here: ', fileName);
  var objectParams = {
    Key: keyName
  };

  let file = _fs.default.createWriteStream(fileName);

  s3.getObject(objectParams).createReadStream().pipe(file).on('close', callBack);
}
/**
 * Loads a file from file system and uploads the content.
 * see upload method.
 * 
 * @param {String} bucketName bucket name
 * @param {String} keyName key name for content on AWS S3
 * @param {String} fileName file path onto file system
 */


function uploadFile(bucketName, keyName, fileName, contentType) {
  _fs.default.readFile(fileName, (err, data) => {
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


async function checkExistence(bucketName, keyName) {
  const s3 = new _awsSdk.default.S3({
    apiVersion: '2006-03-01',
    params: {
      Bucket: bucketName
    }
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