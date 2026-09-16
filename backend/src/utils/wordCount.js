function countWords(text) {
  if (!text || typeof text !== "string") return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

const APPLICATION_MESSAGE_MIN_WORDS = 50;
const APPLICATION_MESSAGE_MAX_WORDS = 100;

function validateApplicationMessage(text) {
  const count = countWords(text);

  if (count < APPLICATION_MESSAGE_MIN_WORDS) {
    return `Please write at least ${APPLICATION_MESSAGE_MIN_WORDS} words.`;
  }

  if (count > APPLICATION_MESSAGE_MAX_WORDS) {
    return `Please keep your message within ${APPLICATION_MESSAGE_MAX_WORDS} words.`;
  }

  return null;
}

module.exports = {
  countWords,
  validateApplicationMessage,
  APPLICATION_MESSAGE_MIN_WORDS,
  APPLICATION_MESSAGE_MAX_WORDS,
};
