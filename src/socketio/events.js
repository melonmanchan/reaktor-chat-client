export default {
  // Generic socket.io events
  CONNECT       : 'connect',
  CONNECT_ERROR : 'connect_error',

  // Login-related things
  NAME_TAKEN    : 'name_taken',
  LOGGED_IN     : 'logged_in',

  // User-related events
  USER_JOINED   : 'user:joined',
  USER_QUIT     : 'user:quit',

  // Messaging stuff
  MESSAGE_POST  : 'message:post'
}
