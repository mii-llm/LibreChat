const { CacheKeys } = require('librechat-data-provider');
const { saveConvo } = require('~/models/Conversation');
const getLogStores = require('~/cache/getLogStores');
const { isEnabled } = require('~/server/utils');

const addTitle = async (req, { text, responseText, conversationId, client }) => {
  const { TITLE_CONVO = 'true' } = process.env ?? {};
  if (!isEnabled(TITLE_CONVO)) {
    return;
  }

  if (client.options.titleConvo === false) {
    return;
  }

  const titleCache = getLogStores(CacheKeys.GEN_TITLE);
  const key = `${req.user.id}-${conversationId}`;

  // Commented because is not working problem with cerebrium client maybe 
  // should be implemented in the serverless but no time
  //const title = await client.titleConvo({ text, conversationId, responseText });
  
  const allWords = text.split(/\s+/);
  // Take only the first 8 words
  const title = allWords.slice(0, 8).join(' ');
  
  await titleCache.set(key, title, 120000);

  await saveConvo(
    req,
    {
      conversationId,
      title,
    },
    { context: 'api/server/services/Endpoints/assistants/addTitle.js' },
  );
};

module.exports = addTitle;
