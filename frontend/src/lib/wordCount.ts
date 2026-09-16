export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export const APPLICATION_MESSAGE_MIN_WORDS = 50;
export const APPLICATION_MESSAGE_MAX_WORDS = 100;

export function validateApplicationMessage(text: string): string | null {
  const count = countWords(text);

  if (count < APPLICATION_MESSAGE_MIN_WORDS) {
    return `Please write at least ${APPLICATION_MESSAGE_MIN_WORDS} words.`;
  }

  if (count > APPLICATION_MESSAGE_MAX_WORDS) {
    return `Please keep your message within ${APPLICATION_MESSAGE_MAX_WORDS} words.`;
  }

  return null;
}
