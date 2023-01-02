export type ActivityPubPluginArgs = {
	domain: string;
	username: string;
	displayName?: string;
	summary?: string;
	outbox?: boolean;
	outboxCollection?: string;
	avatar?: string;
};
