export type Alias = {
	username: string;
	domain: string;
};

export type ActivityPubPluginArgs = {
	domain: string;
	username: string;
	displayName?: string;
	summary?: string;
	outbox?: boolean;
	outboxCollection?: string;
	avatar?: string;
	alias?: Alias;
};
