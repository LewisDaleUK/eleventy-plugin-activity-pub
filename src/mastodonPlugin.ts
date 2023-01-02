/* eslint-disable @typescript-eslint/no-unused-vars */
import { EleventyConfig } from "@11ty/eleventy";
import { ActivityPubPluginArgs } from "./types";

type MastodonPluginOptions = ActivityPubPluginArgs & {
	accessToken: string;
};

export const mastodonPlugin = (
	eleventyConfig: EleventyConfig,
	options: MastodonPluginOptions
) => {
	// not implemented yet
};
