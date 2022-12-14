# Eleventy-Plugin-Activity-Pub

Generate a simple, discoverable ActivityPub user for your Eleventy-powered website.

## Usage

```javascript
const activityPubPlugin = require('eleventy-plugin-activity-pub').default;

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

### Generating an Outbox file

Optionally, you can generate an Outbox file by including `outbox: true`, and the key of the collection that should appear in the outbox:

```javascript
const activityPubPlugin = require('eleventy-plugin-activity-pub').default;

module.exports = function(eleventyConfig) {
	eleventyConfig.addPlugin(activityPubPlugin, {
		domain: 'my-domain.com',
		username: 'user',
		displayName: 'Lewis Dale',
		summary: 'This is my Eleventy website, except now its also discoverable on the Fediverse!',
		outbox: true,
		outboxCollection: 'posts'
	});
}
```

This will create two files: `/outbox`, which contains the root outbox declaration, and `/outbox_1`, which contains all of the actual collection items in descending date - this is for the purposes of simulating a paged Outbox object. It does this by creating, and then quietly deleting, two template files at `<source dir>/outbox/outbox.njk` and `<source dir>/outbox/outbox_page.njk`.

This is a hacky solution until I can find a cleaner way of doing this while still using user-defined collections.