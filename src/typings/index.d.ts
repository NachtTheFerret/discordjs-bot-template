import {
  AnySelectMenuInteraction,
  AnyThreadChannel,
  ApplicationCommandPermissionsUpdateData,
  AutocompleteInteraction,
  AutoModerationActionExecution,
  AutoModerationRule,
  ButtonInteraction,
  ChannelSelectMenuInteraction,
  ChatInputCommandInteraction,
  Client,
  DMChannel,
  Entitlement,
  ForumChannel,
  Guild,
  GuildAuditLogsEntry,
  GuildBan,
  GuildEmoji,
  GuildMember,
  GuildMembersChunk,
  GuildScheduledEvent,
  GuildSoundboardSound,
  GuildTextBasedChannel,
  Interaction,
  Invite,
  MediaChannel,
  MentionableSelectMenuInteraction,
  Message,
  MessageContextMenuCommandInteraction,
  MessageReaction,
  MessageReactionEventDetails,
  ModalSubmitInteraction,
  NewsChannel,
  NonThreadGuildBasedChannel,
  OmitPartialGroupDMChannel,
  PartialGuildMember,
  PartialGuildScheduledEvent,
  PartialMessage,
  PartialMessageReaction,
  PartialSoundboardSound,
  PartialThreadMember,
  PartialUser,
  PollAnswer,
  Presence,
  ReadonlyCollection,
  Role,
  RoleSelectMenuInteraction,
  Snowflake,
  StageInstance,
  Sticker,
  StringSelectMenuInteraction,
  Subscription,
  TextBasedChannel,
  TextChannel,
  ThreadMember,
  Typing,
  User,
  UserContextMenuCommandInteraction,
  UserSelectMenuInteraction,
  VoiceChannel,
  VoiceChannelEffect,
  VoiceState,
} from 'discord.js';

import { ActionType, EventType } from './enum';

export interface ActionCallbackParameters {
  [ActionType.Autocomplete]: AutocompleteInteraction;
  [ActionType.ChatInput]: ChatInputCommandInteraction;
  [ActionType.MessageContext]: MessageContextMenuCommandInteraction;
  [ActionType.UserContext]: UserContextMenuCommandInteraction;
  [ActionType.SelectMenu]: AnySelectMenuInteraction;
  [ActionType.StringSelectMenu]: StringSelectMenuInteraction;
  [ActionType.UserSelectMenu]: UserSelectMenuInteraction;
  [ActionType.RoleSelectMenu]: RoleSelectMenuInteraction;
  [ActionType.MentionableSelectMenu]: MentionableSelectMenuInteraction;
  [ActionType.ChannelSelectMenu]: ChannelSelectMenuInteraction;
  [ActionType.Button]: ButtonInteraction;
  [ActionType.ModalSubmit]: ModalSubmitInteraction;
}

export type ActionCallback<Type extends ActionType> = (
  interaction: ActionCallbackParameters[Type]
) => unknown | Promise<unknown>;

/**
 * Represents an action that can be registered and triggered in a Discord bot.
 * This can include commands, buttons, select menus, and more.
 * Each action has a unique identifier and a type that determines how it will be triggered.
 * @template Type - The type of action, which determines the interaction it handles.
 * @see {@link ActionType} for the list of available action types.
 * @example
 * ```typescript
 * const myAction: Action<ActionType.BUTTON> = {
 *   identifier: 'my-button-action',
 *   type: ActionType.BUTTON,
 *   callback: (interaction) => {
 *     console.log('Button clicked!', interaction);
 *   },
 * };
 */
export type Action<Type extends ActionType> = {
  /**
   * A unique identifier for the action.
   * This should be unique across all actions of the same type.
   * It is used to identify the action when it is triggered.
   * @example 'my-button-action'
   */
  identifier: string;

  /**
   * Indicates whether the action is enabled.
   * If set to false, the action will not be registered or executed.s
   * @default true
   */
  enabled?: boolean;

  /**
   * The type of action.
   * This determines how the action will be triggered and what kind of interaction it will handle.
   * @see {@link ActionType}
   * @example ActionType.BUTTON
   */
  type: Type;

  /**
   * A human-readable name for the action.
   * This is optional and can be used for documentation or debugging purposes.
   * @example 'My Button Action'
   * @default null
   */
  name?: string | null;

  /**
   * A description of the action.
   * This is optional and can be used to provide more context about what the action does.
   * @example 'This action handles button clicks.'
   * @default null
   */
  description?: string | null;

  /**
   * An array of tags associated with the action.
   * Tags can be used for categorization or filtering actions.
   * @example ['utility', 'server']
   * @default null
   */
  tags?: string[] | null;

  /**
   * Usage instructions for the action.
   * This can be a string, an array of strings, or an object containing text and an optional image or GIF URL.
   * It provides guidance on how to use the action.
   * @example '`/my-command <arg1> [arg2]`'
   * @example
   * ```json
   * [
   *   "/my-command <arg1> [arg2]",
   *   "/my-command --help"
   * ]
   * ```
   * @example
   * ```json
   * {
   *   "text": "Use this command to do something.",
   *   "imageOrGifUrl": "https://example.com/image.png"
   * }
   * ```
   * @default null
   */
  usage?: string | string[] | { text: string | string[]; imageOrGifUrl?: string } | null;

  /**
   * The callback function that will be executed when the action is triggered.
   * This function receives the interaction object as its parameter.
   * @param interaction - The interaction object representing the user's action.
   * @returns unknown | Promise<unknown>
   * @example
   * ```typescript
   * (interaction) => {
   *   console.log('Action triggered:', interaction);
   * }
   * ```
   */
  callback: ActionCallback<Type>;
};

export interface EventCallbackParameters extends Record<EventType, unknown[]> {
  [EventType.ApplicationCommandPermissionsUpdate]: [data: ApplicationCommandPermissionsUpdateData];
  [EventType.AutoModerationActionExecution]: [autoModerationActionExecution: AutoModerationActionExecution];
  [EventType.AutoModerationRuleCreate]: [autoModerationRule: AutoModerationRule];
  [EventType.AutoModerationRuleDelete]: [autoModerationRule: AutoModerationRule];
  [EventType.AutoModerationRuleUpdate]: [
    oldAutoModerationRule: AutoModerationRule | null,
    newAutoModerationRule: AutoModerationRule
  ];
  [EventType.CacheSweep]: [message: string];
  [EventType.ChannelCreate]: [channel: NonThreadGuildBasedChannel];
  [EventType.ChannelDelete]: [channel: DMChannel | NonThreadGuildBasedChannel];
  [EventType.ChannelPinsUpdate]: [channel: TextBasedChannel, date: Date];
  [EventType.ChannelUpdate]: [
    oldChannel: DMChannel | NonThreadGuildBasedChannel,
    newChannel: DMChannel | NonThreadGuildBasedChannel
  ];
  [EventType.Debug]: [message: string];
  [EventType.Warn]: [message: string];
  [EventType.GuildEmojiCreate]: [emoji: GuildEmoji];
  [EventType.GuildEmojiDelete]: [emoji: GuildEmoji];
  [EventType.GuildEmojiUpdate]: [oldEmoji: GuildEmoji, newEmoji: GuildEmoji];
  [EventType.EntitlementCreate]: [entitlement: Entitlement];
  [EventType.EntitlementDelete]: [entitlement: Entitlement];
  [EventType.EntitlementUpdate]: [oldEntitlement: Entitlement | null, newEntitlement: Entitlement];
  [EventType.Error]: [error: Error];
  [EventType.GuildAuditLogEntryCreate]: [auditLogEntry: GuildAuditLogsEntry, guild: Guild];
  [EventType.GuildAvailable]: [guild: Guild];
  [EventType.GuildBanAdd]: [ban: GuildBan];
  [EventType.GuildBanRemove]: [ban: GuildBan];
  [EventType.GuildCreate]: [guild: Guild];
  [EventType.GuildDelete]: [guild: Guild];
  [EventType.GuildUnavailable]: [guild: Guild];
  [EventType.GuildIntegrationsUpdate]: [guild: Guild];
  [EventType.GuildMemberAdd]: [member: GuildMember];
  [EventType.GuildMemberAvailable]: [member: GuildMember | PartialGuildMember];
  [EventType.GuildMemberRemove]: [member: GuildMember | PartialGuildMember];
  [EventType.GuildMembersChunk]: [
    members: ReadonlyCollection<Snowflake, GuildMember>,
    guild: Guild,
    data: GuildMembersChunk
  ];
  [EventType.GuildMemberUpdate]: [oldMember: GuildMember | PartialGuildMember, newMember: GuildMember];
  [EventType.GuildUpdate]: [oldGuild: Guild, newGuild: Guild];
  [EventType.GuildSoundboardSoundCreate]: [soundboardSound: GuildSoundboardSound];
  [EventType.GuildSoundboardSoundDelete]: [soundboardSound: GuildSoundboardSound | PartialSoundboardSound];
  [EventType.GuildSoundboardSoundUpdate]: [
    oldSoundboardSound: GuildSoundboardSound | null,
    newSoundboardSound: GuildSoundboardSound
  ];
  [EventType.GuildSoundboardSoundsUpdate]: [
    soundboardSounds: ReadonlyCollection<Snowflake, GuildSoundboardSound>,
    guild: Guild
  ];
  [EventType.InviteCreate]: [invite: Invite];
  [EventType.InviteDelete]: [invite: Invite];
  [EventType.MessageCreate]: [message: OmitPartialGroupDMChannel<Message>];
  [EventType.MessageDelete]: [message: OmitPartialGroupDMChannel<Message | PartialMessage>];
  [EventType.MessagePollVoteAdd]: [pollAnswer: PollAnswer, userId: Snowflake];
  [EventType.MessagePollVoteRemove]: [pollAnswer: PollAnswer, userId: Snowflake];
  [EventType.MessageReactionRemoveAll]: [
    message: OmitPartialGroupDMChannel<Message | PartialMessage>,
    reactions: ReadonlyCollection<string | Snowflake, MessageReaction>
  ];
  [EventType.MessageReactionRemoveEmoji]: [reaction: MessageReaction | PartialMessageReaction];
  [EventType.MessageBulkDelete]: [
    messages: ReadonlyCollection<Snowflake, OmitPartialGroupDMChannel<Message | PartialMessage>>,
    channel: GuildTextBasedChannel
  ];
  [EventType.MessageReactionAdd]: [
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser,
    details: MessageReactionEventDetails
  ];
  [EventType.MessageReactionRemove]: [
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser,
    details: MessageReactionEventDetails
  ];
  [EventType.MessageUpdate]: [
    oldMessage: OmitPartialGroupDMChannel<Message | PartialMessage>,
    newMessage: OmitPartialGroupDMChannel<Message>
  ];
  [EventType.PresenceUpdate]: [oldPresence: Presence | null, newPresence: Presence];
  [EventType.ClientReady]: [client: Client<true>];
  [EventType.Invalidated]: [];
  [EventType.GuildRoleCreate]: [role: Role];
  [EventType.GuildRoleDelete]: [role: Role];
  [EventType.GuildRoleUpdate]: [oldRole: Role, newRole: Role];
  [EventType.ThreadCreate]: [thread: AnyThreadChannel, newlyCreated: boolean];
  [EventType.ThreadDelete]: [thread: AnyThreadChannel];
  [EventType.ThreadListSync]: [threads: ReadonlyCollection<Snowflake, AnyThreadChannel>, guild: Guild];
  [EventType.ThreadMemberUpdate]: [oldMember: ThreadMember, newMember: ThreadMember];
  [EventType.ThreadMembersUpdate]: [
    addedMembers: ReadonlyCollection<Snowflake, ThreadMember>,
    removedMembers: ReadonlyCollection<Snowflake, ThreadMember | PartialThreadMember>,
    thread: AnyThreadChannel
  ];
  [EventType.ThreadUpdate]: [oldThread: AnyThreadChannel, newThread: AnyThreadChannel];
  [EventType.TypingStart]: [typing: Typing];
  [EventType.UserUpdate]: [oldUser: User | PartialUser, newUser: User];
  [EventType.VoiceChannelEffectSend]: [voiceChannelEffect: VoiceChannelEffect];
  [EventType.VoiceStateUpdate]: [oldState: VoiceState, newState: VoiceState];
  [EventType.WebhooksUpdate]: [channel: TextChannel | NewsChannel | VoiceChannel | ForumChannel | MediaChannel];
  [EventType.InteractionCreate]: [interaction: Interaction];
  [EventType.ShardDisconnect]: [closeEvent: CloseEvent, shardId: number];
  [EventType.ShardError]: [error: Error, shardId: number];
  [EventType.ShardReady]: [shardId: number, unavailableGuilds: Set<Snowflake> | undefined];
  [EventType.ShardReconnecting]: [shardId: number];
  [EventType.ShardResume]: [shardId: number, replayedEvents: number];
  [EventType.StageInstanceCreate]: [stageInstance: StageInstance];
  [EventType.StageInstanceUpdate]: [oldStageInstance: StageInstance | null, newStageInstance: StageInstance];
  [EventType.StageInstanceDelete]: [stageInstance: StageInstance];
  [EventType.GuildStickerCreate]: [sticker: Sticker];
  [EventType.GuildStickerDelete]: [sticker: Sticker];
  [EventType.GuildStickerUpdate]: [oldSticker: Sticker, newSticker: Sticker];
  [EventType.SubscriptionCreate]: [subscription: Subscription];
  [EventType.SubscriptionDelete]: [subscription: Subscription];
  [EventType.SubscriptionUpdate]: [oldSubscription: Subscription | null, newSubscription: Subscription];
  [EventType.GuildScheduledEventCreate]: [guildScheduledEvent: GuildScheduledEvent];
  [EventType.GuildScheduledEventUpdate]: [
    oldGuildScheduledEvent: GuildScheduledEvent | PartialGuildScheduledEvent | null,
    newGuildScheduledEvent: GuildScheduledEvent
  ];
  [EventType.GuildScheduledEventDelete]: [guildScheduledEvent: GuildScheduledEvent | PartialGuildScheduledEvent];
  [EventType.GuildScheduledEventUserAdd]: [
    guildScheduledEvent: GuildScheduledEvent | PartialGuildScheduledEvent,
    user: User
  ];
  [EventType.GuildScheduledEventUserRemove]: [
    guildScheduledEvent: GuildScheduledEvent | PartialGuildScheduledEvent,
    user: User
  ];
  [EventType.SoundboardSounds]: [soundboardSounds: ReadonlyCollection<Snowflake, GuildSoundboardSound>, guild: Guild];
}

export type EventCallback<Type extends EventType> = (
  ...parameters: EventCallbackParameters[Type]
) => unknown | Promise<unknown>;

export interface Event<Type extends EventType> {
  identifier: string;
  enabled?: boolean;
  type: Type;
  name?: string | null;
  description?: string | null;
  tags?: string[] | null;
  usage?: string | string[] | { text: string | string[]; imageOrGifUrl?: string } | null;
  callback: EventCallback<Type>;
}
