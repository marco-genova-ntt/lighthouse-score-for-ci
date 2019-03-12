# LightHouse score for CI
[![Build Status](https://travis-ci.org/marco-genova-ntt/lighthouse-score-for-ci.svg?branch=master)](https://travis-ci.org/marco-genova-ntt/lighthouse-score-for-ci)
[![Coverage Status](https://coveralls.io/repos/github/marco-genova-ntt/lighthouse-score-for-ci/badge.svg?branch=master)](https://coveralls.io/github/marco-genova-ntt/lighthouse-score-for-ci?branch=master)

The goal of this module is to enable the creation of a very simple step for continous integratraion and google lighthouse.(https://developers.google.com/web/tools/lighthouse/)

## Scope

The flow is very simple:

* Download the project from github or install via npm
* build the project
* define the web pages array (JSON Array)
* define the file .env
* starts the analysis

**prerequiste**: Chrome installed on the host machine.

## Download from npm

>npm install lighthouse-ci


## Clone the project from github


>git clone https://github.com/marco-genova-ntt/lighthouse-score-for-ci.git


## Build project

>npm install

>npm run jest

>npm run build

## Define .env file
The file _.env_ is managed by node_modules dotenv (https://www.npmjs.com/package/dotenv)

A template to start application follows

```
#Slack token for the slack client, An access token (from your Slack app or custom integration - xoxp, xoxb)
SLACK_TOKEN=xoxb-.....,

#Slack channel identifier, use Web API simulator to extract this value (https://api.slack.com/methods/conversations.list)
SLACK_CHANNEL_ID=C6H41XTRU

#Base api url, use this for the actual version of api
SLACK_BASE_API=https://slack.com/api/{method}?token={token}&pretty=1

#Write on AWS (true enable/false disable), guide the usage of .local_storage.json on AWS
AWS_S3_WRITING_ENABLED=true

#AWS S3 Bucket name, to define on your AWS Console S3 (CHANGEIT!!!)
AWS_BUCKET_NAME=test.slackplugin

#AWS base url change the bucket name in the url but don't change the {processID}
AWS_S3_TEMPLATE_RESOURCE=https://s3.eu-north-2.amazonaws.com/test.slackplugin/{processID}.html

#manged by standard mechanism
#AWS_SECURITY (managed by environment variables)
#AWS SECURITY MANAGENT
AWS_ACCESS_KEY_ID=.....
AWS_SECRET_ACCESS_KEY=....

#RESULT SERIES MANAGEMNET
#Where database of the results will be saved during runs
#this configuartion is available for LOCAL and AWS store localtion
SERIES_SERVICE_DATABASE_FILE=./tmp/allseries-database.json

#If true enable the store of the database on AWS S3 using bucket informaton
SERIES_SERVICE_DATABASE_FILE_ON_AWS=true

#SERIES Report on result tred
SERIES_ENABLE_TREND_REPORT=true

#Default templates based on anychart (generated bu plauground of anychart)
SERIES_TEMAPLTE_TREND_FILE=./templates/series/anychart-template.txt

#Save reports in AWS S3 using bucket informaton
SERIES_ENABLE_TREND_REPORT_ON_AWS=true

#When report trend is enabled this properties reports the index template file
SERIES_TEMAPLTE_INDEX_FILE=./templates/series/index.txt

#Sets the env to select a sets of page
LIGHTHOUSE_CI_ENV=qa
```

## Define pages.json

**(V0.3.0+)** The paegs are divided for environment, the default environment is _"default"_

```
{
    "env1" : ['https://www.sample.com',
            'https://www.sample.com/page2?param=1'],
    "env2" : ['https://www.sample2.com',
            'https://www.sample2.com/page2?param=1']
}

```

## Local Storage

The local storage is based on json database to get and set some utilities values (e.g. process identifier to generate unique reports).
Actually the file is fixed: **.local_storage.json**

**(V0.5.0+)** In order to support dockerization and idempotention of the execution the file can be saved on AWS. This mechanism is configured by prop:
```
AWS_S3_WRITING_ENABLED
```
## Chrome Configuration

the file chrome_config.json contains the lighthouse configuration. There's a standard configuration, follows this guide to understando how to personalize: https://github.com/GoogleChrome/lighthouse/blob/master/docs/readme.md

## Technological stack

* NodeJS 8+
* Babel 7
* AWS-SDK
* Jest
* Dotenv
* LightHouse score for slack:  https://www.npmjs.com/package/lighthouse-score-for-slack

The project is ES6-based.

### Enable a simple bot on slack

I have create a simple app not distributed (actually) to manage the connection between simple bot and slack workspace. 

![Slack App configured](https://github.com/marco-genova-ntt/lighthouse-ci/blob/master/assets/img/slack-workspace.png)

Reference to slack guide: https://api.slack.com/slack-apps

### Create a bucket on Amazon Web Services (AWS) S3

This guide can be very helpful to create a bucket specific for this scenario: https://docs.aws.amazon.com/AmazonS3/latest/dev/WebsiteHosting.html

## Notes

### CentsOS 7

Install Google Shrome Stable, follows this very simple guide: https://allmytechproblems.blogspot.com/2019/02/install-chrome-stable-version-on-centos.html

In the file _chrome_config.json_ add some options, follows working example:

```
{
    "chromeFlags": [
        "--print-config",
        "--headless",
        "--no-sandbox",
        "--disable-gpu"
    ],
    "emulatedFormFactor": "mobile",
    "disableDeviceEmulation": false,
    "throttlingMethod": "simulate"
}
```

### Default report directory
The application generates reports in a default directory

`<project_dir>/_reports`

Acutally can not be changed.

### Series Report HTML Format and related Index
Actually the results series report are generated by a simple aproach using a template based on anychart.

In this case We've used a replace in a html page generated by https://playground.anychart.com/.

We've substituted to ready html a placeholder, during report generation the placeholder are substituted by real values.

**Example** the actual series report:

![Series Report](https://github.com/marco-genova-ntt/lighthouse-ci/blob/master/assets/img/series-report.png)

When The series report is enabled an index.html file is generated in first instance on the file system and, optionally, on AWS S3 (if the report series is enabled to AWS S3 storage).

**Example** Series Reports Index:

![Series Reports Index](https://github.com/marco-genova-ntt/lighthouse-ci/blob/master/assets/img/index-serie-reports.png)

This is the index of AWS S3 web reposistory.
The default web page is based on a template with stack:

* bootstrap
* jquery

### Docker launch and pages
My advice is to enable the choioce of oages set directly from docker un command forcing the environment variable:

```
LIGHTHOUSE_CI_ENV=qa
```

let me say to remove from .env file and force the values from docket command like this:

>docker run -e "LIGHTHOUSE_CI_ENV=qa" lighthouse-slack-ci
