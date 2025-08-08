import {
  AnySelectMenuInteraction,
  AnyThreadChannel,
  ApplicationCommandPermissionsUpdateData,
  AutocompleteInteraction,
  AutoModerationActionExecution,
  AutoModerationRule,
  ButtonInteraction,
  ChannelSelectMenuInteraction,
  ChatInputApplicationCommandData,
  ChatInputCommandInteraction,
  Client,
  CloseEvent,
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
  MessageApplicationCommandData,
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
  UserApplicationCommandData,
  UserContextMenuCommandInteraction,
  UserSelectMenuInteraction,
  VoiceChannel,
  VoiceChannelEffect,
  VoiceState,
  Events as EventType,
  Locale,
  MessagePayload,
  MessageCreateOptions,
  BaseMessageOptions,
  InteractionReplyOptions,
} from 'discord.js';

import { ActionType, CustomErrorSeverity, CustomMessageType } from './enum';

export interface ActionCallbackParameters extends Record<ActionType, Interaction> {
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

export interface BaseAction<Type extends ActionType> {
  /**
   * A unique identifier for the action.
   * This should be unique across all actions of the same type.
   * It is used to identify the action when it is triggered.
   * @example 'my-button-action'
   */
  identifier: string;

  /**
   * Whether the action is enabled or disabled.
   * If true, the action will be active and can be triggered.
   * If false, the action will not respond to interactions and won't be registered.
   * @default false
   */
  disabled?: boolean;

  /**
   * The type of action.
   * This determines how the action will be triggered and what kind of interaction it will handle.
   * @see {@link ActionType}
   * @example ActionType.BUTTON
   */
  type: Type;

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
}

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
export type Action<Type extends ActionType> = BaseAction<Type> & {
  type: ActionType.ChatInput | ActionType.MessageContext | ActionType.UserContext;

  /**
   * Whether the action is private.
   * If false, the action will be registered globally and can be used by anyone.
   * If true, the action won't be registered globally and can registered only in guilds.
   * @default false
   */
  private?: boolean;
} & (
    | {
        type: ActionType.ChatInput;

        /**
         * The data for the chat input application command.
         * This is required for chat input commands and defines the command's name, description, options, etc.
         * @see {@link https://discord.js.org/docs/packages/discord.js/14.21.0/ChatInputApplicationCommandData:Interface}
         */
        data: ChatInputApplicationCommandData;
      }
    | {
        type: ActionType.MessageContext;

        /**
         * The data for the message application command.
         * This is required for message context commands and defines the command's name, description, options, etc.
         * @see {@link https://discord.js.org/docs/packages/discord.js/14.21.0/MessageApplicationCommandData:Interface}
         */
        data: MessageApplicationCommandData;
      }
    | {
        type: ActionType.UserContext;

        /**
         * The data for the user context application command.
         * This is required for user context commands and defines the command's name, description, options, etc.
         * @see {@link https://discord.js.org/docs/packages/discord.js/14.21.0/UserApplicationCommandData:Interface}
         */
        data: UserApplicationCommandData;
      }
  );

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

/**
 * Represents an event that can be registered and triggered in a Discord bot.
 * Each event has a unique identifier and a type that determines how it will be triggered.
 * @template Type - The type of event, which determines the parameters it handles.
 * @see {@link EventType} for the list of available event types.
 * @example
 * ```typescript
 * const myEvent: Event<EventType.MessageCreate> = {
 *   identifier: 'my-message-event',
 *   type: EventType.MessageCreate,
 *   callback: (message) => {
 *     console.log('Message received!', message);
 *   },
 * };
 * ```
 */
export interface Event<Type extends EventType> {
  /**
   * A unique identifier for the event.
   * This should be unique across all events of the same type.
   * It is used to identify the event when it is triggered.
   * @example 'my-message-event'
   */
  identifier: string;

  /**
   * Whether the event is enabled or disabled.
   * If true, the event will be active and can be triggered.
   * If false, the event will not respond and won't be registered.
   * @default false
   */
  disabled?: boolean;

  /**
   * The type of event.
   * This determines how the event will be triggered and what parameters it will handle.
   * @see {@link EventType}
   * @example EventType.MessageCreate
   */
  type: Type;

  /**
   * The callback function that will be executed when the event is triggered.
   * This function receives the event parameters as its arguments.
   * @param parameters - The parameters for the event, as defined by EventCallbackParameters.
   * @returns unknown | Promise<unknown>
   * @example
   * ```typescript
   * (message) => {
   *   console.log('Event triggered:', message);
   * }
   * ```
   */
  callback: EventCallback<Type>;
}

/**
 * Represents the content of a custom message that can be localized.
 * This can be a string, a base message options object, or a function that returns either.
 *
 * Français : Représente le contenu d'un message personnalisé qui peut être localisé.
 * Cela peut être une chaîne de caractères, un objet d'options de message de base,
 * ou une fonction qui retourne l'un ou l'autre.
 */
export type CustomLocalizedMessageContent =
  | string
  | BaseMessageOptions
  | ((...params: unknown[]) => string | BaseMessageOptions);

export interface CustomLocalizedMessage {
  /**
   * The default message content for the custom localized message.
   * This is used when no specific locale is provided or when the locale is not found.
   *
   * Français : Le contenu du message par défaut pour le message localisé personnalisé.
   * Cela est utilisé lorsque aucune locale spécifique n'est fournie ou lorsque la locale n'est
   */
  default: CustomLocalizedMessageContent;

  /**
   * Additional localized message content for specific locales.
   * The keys are locale identifiers based on the Discord.js Locale enum
   * If a locale is not found, the default message will be used.
   *
   * Français : Contenu de message localisé supplémentaire pour des locales spécifiques.
   * Les clés sont des identifiants de locale basés sur l'énumération Locale de Discord.js.
   * Si une locale n'est pas trouvée, le message par défaut sera utilisé.
   */
  [locale: string]: CustomLocalizedMessageContent | undefined;
}

export interface CustomErrorPayload {
  /**
   * The message configuration for the custom error.
   * This includes a default message and an optional code for localization.
   *
   * Français : La configuration du message pour l'erreur personnalisée.
   * Cela inclut un message par défaut et un code optionnel pour la localisation.
   */
  message: { default: string; code?: CustomMessageType };

  /**
   * The severity of the custom error.
   * This indicates how critical the error is and whether it should be logged.
   *
   * Français : La sévérité de l'erreur personnalisée.
   * Cela indique à quel point l'erreur est critique et si elle doit être enregistrée.
   */
  severity?: CustomErrorSeverity;

  /**
   * Whether the error should be logged.
   * If true, the error will be logged to the console or a logging service.
   *
   * Français : Si l'erreur doit être enregistrée.
   * Si vrai, l'erreur sera enregistrée dans la console ou un service de journalisation.
   */
  loggable?: boolean;
}
