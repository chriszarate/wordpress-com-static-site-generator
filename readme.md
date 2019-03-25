# WordPress.com Static Site Generator

This is a simple static site generator that uses the wordpress.com REST API as
a backend and publishes to an AWS S3 bucket. If you use CloudFront to serve /
terminate TLS, it will issue an invalidation request.

It uses AWS API Gateway to provide a webhook, which is called whenever you
publish or update a post (or page) on wordpress.com. It will look a lot like
[my blog][blog], because that's what it is.



1. Copy `config.example.js` to `config.js` and edit it.

2. Create the webhook on AWS:

```sh
npm run setup
```

3. Give the Lambda function permission to write to your S3 bucket.

```sh
npm run policy
```

4. [Add the webhook][webhook] to your wordpress.com site for the following events:

```
publish_post
publish_page
```

## Updating manually

When running locally, make sure your AWS credentials are available.

```sh
npm run publish
```

Alternatively, you can just `POST` to your endpoint:

```sh
curl -X POST https://API_GATEWAY_ID.execute-api.AWS_REGION.amazonaws.com/latest/update
```


[blog]: https://chris.zarate.org
[webhook]: https://en.support.wordpress.com/webhooks/
