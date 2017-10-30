# Artanis

![alt text](https://raw.githubusercontent.com/rafaelcorreiapoli/artanis/master/src/resources/images/artanis.jpg)

*" Your next Static Website using AWS infrastructure with one command! "*

## Features
- ✅ Static website with S3
- ✅ CDN with CloudFront
- ✅ SSL Certificates with ACM
- ✅ DNS Records with Route 53


## Setup
By default, `artanis` will use your credentials stored in `~/.aws/credentials`
It should be something like this:
```
[default]
aws_access_key_id=<YOUR_AWS_ACCESS_KEY_ID>
aws_secret_access_key=<YOUR_AWS_SECRET_ACCESS_KEY>
region=<YOUR_AWS_DEFAULT_REGION>
```

## Usage
```
npm install -g artanis-cli
artanis new my-awesome-static-website
```


## Todo
- [ ] Buy domains
- [ ] Better error handling
- [ ] Interactive CLI
