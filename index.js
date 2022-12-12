const fs = require('fs');

/**
 * 
 * @param { domain: string, username: string, displayName?: string, summary?: string, } config 
 * @returns 
 */
module.exports = (eleventyConfig, {
	domain,
	username,
	displayName = username,
	summary
}) => {
	eleventyConfig.on('eleventy.after', ({ dir }) => {
		const actorDef = {
			"@context": [
				"https://www.w3.org/ns/activitystreams",
				"https://w3id.org/security/v1"
			],
		
			id: `https://${domain}/${username}`,
			type: "Person",
			preferredUsername: username,
			name: displayName,
			url: domain,
			attachments: [
				{
					"type": "PropertyValue",
					"name": "Website",
					"value": `https://${domain}`
				}
			],
			summary,
		}
		fs.writeFileSync(`${dir.output}/${username}`, JSON.stringify(actorDef));
		fs.writeFileSync(`${dir.output}/${username}.json`, JSON.stringify(actorDef));
	});

	eleventyConfig.on('eleventy.after', ({ dir }) => {
		if (!fs.existsSync(`${dir.output}/.well-known`)) {
			fs.mkdirSync(`${dir.output}/.well-known`);
		}

		const wf = {
			subject: `acct:${username}@${domain}`,
			links: [
				{
					rel: "self",
					type: "application/activity+json",
					href: `https://${domain}/${username}`
				},
				{
					rel: "http://webfinger.net/rel/profile-page",
					type: "text/html",
					href: `https://${domain}/blog`
				}
			]
		};
		fs.writeFileSync(`${dir.output}/.well-known/webfinger`, JSON.stringify(wf));
	});

	return eleventyConfig;
};