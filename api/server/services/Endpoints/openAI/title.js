const { CacheKeys } = require('librechat-data-provider');
const getLogStores = require('~/cache/getLogStores');
const { isEnabled } = require('~/server/utils');
const { saveConvo } = require('~/models');

const addTitle = async (req, { text, response, client }) => {
  const { TITLE_CONVO = 'true' } = process.env ?? {};
  if (!isEnabled(TITLE_CONVO)) {
    return;
  }

  if (client.options.titleConvo === false) {
    return;
  }

  // If the request was aborted and is not azure, don't generate the title.
  if (!client.azure && client.abortController.signal.aborted) {
    return;
  }

  const titleCache = getLogStores(CacheKeys.GEN_TITLE);
  const key = `${req.user.id}-${response.conversationId}`;

  // Commented because is not working problem with cerebrium client maybe 
  // should be implemented in the serverless but no time
  /*
  const title = await client.titleConvo({
    text,
    responseText: response?.text ?? '',
    conversationId: response.conversationId,
  });*/
  const allWords = text.split(/\s+/);
  // Take only the first 8 words
  const title = allWords.slice(0, 8).join(" ");

  await titleCache.set(key, title, 120000);
  await saveConvo(
    req,
    {
      conversationId: response.conversationId,
      title,
    },
    { context: 'api/server/services/Endpoints/openAI/addTitle.js' },
  );
};

module.exports = addTitle;
