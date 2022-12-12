# Eleventy-Plugin-Activity-Pub

Generate a simple, discoverable ActivityPub user for your Eleventy-powered website.

## Usage

```javascript
const activityPubPlugin = require('eleventy-plugin-activity-pub');

module.exports = function(eleventyConfig) {
	eleventyConfig.addPlugin(activityPubPlugin, {
		domain: 'my-domain.com',
		username: 'user',
		displayName: 'Lewis Dale',
		summary: 'This is my Eleventy website, except now its also discoverable on the Fediverse!',
	});
}
```

This will generate two files: a basic Actor file at `my-domain/user.json`, and a webfinger file at `my-domain/.well-known/webfinger`, both of which are can be used to discover your website as a user on the Fediverse - e.g. you can tag your blog in comments as `@{user}@{domain}`