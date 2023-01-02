import { EleventyConfig, CollectionItem } from "@11ty/eleventy";
import * as fs from "node:fs";
import path = require("node:path");
import { ActivityPubPluginArgs } from "./types";

export const activityPubPlugin = (
	eleventyConfig: EleventyConfig,
	{
		domain,
		username,
		displayName = username,
		summary,
		outbox,
		outboxCollection,
		avatar,
	}: ActivityPubPluginArgs
) => {
	eleventyConfig.on("eleventy.after", ({ dir }) => {
		const url = `https://${domain}`;

		const actorDef: ActorDef = {
			"@context": [
				"https://www.w3.org/ns/activitystreams",
				"https://w3id.org/security/v1",
			],

			id: `https://${domain}/${username}`,
			type: "Person",
			preferredUsername: username,
			name: displayName,
			url: domain,
			inbox: `${url}/inbox`,
			attachments: [
				{
					type: "PropertyValue",
					name: "Website",
					value: `https://${domain}`,
				},
			],
			summary,
		};

		if (avatar) {
			actorDef.icon = {
				type: "Image",
				mediaType: "image/jpeg", // TODO: Detect mediaType
				url: avatar,
			};
		}

		if (outbox) {
			actorDef.outbox = `${url}/outbox_1`;
		}

		fs.writeFileSync(`${dir.output}/${username}`, JSON.stringify(actorDef));
		fs.writeFileSync(
			`${dir.output}/${username}.json`,
			JSON.stringify(actorDef)
		);
	});

	eleventyConfig.on("eleventy.after", ({ dir }) => {
		if (!fs.existsSync(`${dir.output}/.well-known`)) {
			fs.mkdirSync(`${dir.output}/.well-known`);
		}

		const wf = {
			subject: `acct:${username}@${domain}`,
			links: [
				{
					rel: "self",
					type: "application/activity+json",
					href: `https://${domain}/${username}`,
				},
				{
					rel: "http://webfinger.net/rel/profile-page",
					type: "text/html",
					href: `https://${domain}/blog`,
				},
			],
		};
		fs.writeFileSync(`${dir.output}/.well-known/webfinger`, JSON.stringify(wf));
	});

	eleventyConfig.addFilter("activitypubjson", (obj) =>
		JSON.stringify(obj, null, 2)
	);

	eleventyConfig.addFilter("activitypubwrapoutbox", (obj) => ({
		"@context": ["https://www.w3.org/ns/activitystreams"],
		type: "OrderedCollectionPage",
		id: `https://${domain}/outbox`,
		orderedItems: obj,
	}));

	eleventyConfig.addFilter("activitypuboutboxroot", (items) => ({
		"@context": "https://www.w3.org/ns/activitystreams",
		id: `https://${domain}/${username}/outbox`,
		type: "OrderedCollection",
		totalItems: items.length,
		first: `https://${domain}/outbox_page`,
		last: `https://${domain}/outbox_page`,
	}));

	eleventyConfig.addFilter("activitypuboutbox", (items: CollectionItem[]) => ({
		"@context": "https://www.w3.org/ns/activitystreams",
		type: "OrderedCollectionPage",
		id: `https://${domain}/outbox_1`,
		orderedItems: items.sort().map((item) => ({
			actor: `https://${domain}/${username}`,
			type: "Create",
			published: item.date.toISOString(),
			id: `https://${domain}${item.url}publish`,
			to: ["https://www.w3.org/ns/activitystreams#Public"],
			object: {
				attributedTo: `https://${domain}/${username}`,
				content: `<p>${item.data.title}</p><p><a href="https://${domain}${item.url}">https://${domain}${item.url}</a></p>`,
				id: `https://${domain}/${item.url}`,
				inReplyTo: null,
				published: item.date.toISOString(),
				to: ["https://www.w3.org/ns/activitystreams#Public"],
				type: "Note",
				url: `https://${domain}${item.url}`,
			},
		})),
	}));

	if (outbox) {
		eleventyConfig.addGlobalData(
			"activitypuboutboxcollection",
			outboxCollection
		);

		eleventyConfig.on("eleventy.before", ({ dir }) => {
			fs.mkdirSync(`${dir.input}/outbox`);
			fs.copyFileSync(
				`${__dirname}/../src/templates/outbox.njk`,
				path.resolve(`./${dir.input}/outbox/outbox.njk`)
			);
			fs.copyFileSync(
				`${__dirname}/../src/templates/outbox_page.njk`,
				`./${dir.input}/outbox/outbox_page.njk`
			);
		});

		eleventyConfig.on("eleventy.after", ({ dir }) => {
			fs.rmSync(`${dir.input}/outbox`, { recursive: true, force: true });
		});
	}
};

type ActorDef = {
	"@context": string[];
	id: string;
	type: string;
	preferredUsername: string;
	name: string;
	url: string;
	inbox: string;
	outbox?: string;
	attachments: ActorDefAttachment[];
	summary?: string;
	icon?: Icon;
};

type ActorDefAttachment = {
	type: string;
	name: string;
	value: string;
};

type Icon = {
	type: string;
	url: string;
	mediaType: string;
};
