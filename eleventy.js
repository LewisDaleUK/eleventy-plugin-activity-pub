const fs = require('fs');

/**
 * 
 * @param { domain: string, username: string, displayName?: string, summary?: string, } config 
 * @returns 
 */
module.exports = ({
	domain,
	username,
	displayName = username,
	summary
}) => eleventyConfig => {
	eleventyConfig.on('eleventy.after', ({ dir }) => {
		const actorDef = {
			"@context": [
				"https://www.w3.org/ns/activitystreams",
				"https://w3id.org/security/v1"
			],
		
			id: `https://${domain}/${actor}`,
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
		fs.writeFileSync(`${dir.output}/${actor}.json`, JSON.stringify(actorDef));
	});

	eleventyConfig.on('eleventy.after', ({ dir }) => {
		if (!fs.existsSync(`${dir.output}/.well-known`)) {
			fs.mkdirSync(`${dir.output}/.well-known`);
		}

		const wf = {
			subject: `acct:${actor}@${domain}`,
			links: [
				{
					rel: "self",
					type: "application/activity+json",
					href: `https://${domain}/${actor}`
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
};