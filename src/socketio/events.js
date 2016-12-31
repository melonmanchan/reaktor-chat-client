export default {
  // Generic socket.io events
  CONNECT       : 'connect',
  CONNECT_ERROR : 'connect_error',

  // Login-related things
  NAME_TAKEN    : 'name_taken',
  LOGGED_IN     : 'logged_in',

  // User-related events
  USER_JOINED        : 'user : joined',
  USER_QUIT          : 'user : quit',
  USER_LEFT          : 'user : left',
  USER_STATUS_CHANGE : 'user : status_changed',

  // Messaging stuff
  MESSAGE_POST  : 'message:post'
}
