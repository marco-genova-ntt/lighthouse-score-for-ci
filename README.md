# LightHouse CI 
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


>git clone https://github.com/marco-genova-ntt/lighthouse-ci


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

#Write on AWS (true enable/false disable)
AWS_S3_WRITING_ENABLED=true

#AWS S3 Bucket name, to define on your AWS Console S3 (CHANGEIT!!!)
AWS_BUCKET_NAME=test.slackplugin

#manged by standard mechanism
#AWS_SECURITY (managed by <user_home>/.aws/credentials)

#AWS base url change the bucket name in the url but don't change the {processID}
AWS_S3_TEMPLATE_RESOURCE=https://s3.eu-north-2.amazonaws.com/test.slackplugin/{processID}.html
```

## Define pages.json

```
[
    'https://www.sample.com',
    'https://www.sample.com/page2?param=1'
]

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

![Slack App configured](https://github.com/marco-genova-ntt/lighthouse-score-for-slack/blob/master/assests/img/slack-workspace.png)

Reference to slack guide: https://api.slack.com/slack-apps

### Create a bucket on Amazon Web Services (AWS) S3

This guide can be very helpful to create a bucket specific for this scenario: https://docs.aws.amazon.com/AmazonS3/latest/dev/WebsiteHosting.html