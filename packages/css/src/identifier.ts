import hash from '@emotion/hash';

import { getIdentOption } from './adapter';
import { getAndIncrementRefCounter, getFileScope } from './fileScope';

function getDevPrefix(debugId: string | undefined) {
  const parts = debugId ? [debugId.replace(/\s/g, '_')] : [];
  const { filePath } = getFileScope();

  const matches = filePath.match(
    /(?<dir>[^\/\\]*)?[\/\\]?(?<file>[^\/\\]*)\.css\.(ts|js|tsx|jsx)$/,
  );

  if (matches && matches.groups) {
    const { dir, file } = matches.groups;
    parts.unshift(file && file !== 'index' ? file : dir);
  }

  return parts.join('_');
}

export function generateIdentifier(debugId: string | undefined) {
  const refCount = getAndIncrementRefCounter();
  const { filePath, packageName } = getFileScope();

  const fileScopeStr = packageName ? `${packageName}${filePath}` : filePath;

  const opt = getIdentOption();

  if (opt === 'debug' || opt === 'short') {
    // Convert ref count to base 36 for optimal hash lengths
    const refCountStr = refCount.toString(36);
    const fileScopeHash = hash(fileScopeStr);
    let identifier = `${fileScopeHash}${refCountStr}`;

    if (opt === 'debug') {
      const devPrefix = getDevPrefix(debugId);

      if (devPrefix) {
        // Convert ref count to base 36 for optimal hash lengths
        identifier = `${devPrefix}__${hash(fileScopeStr)}${refCount.toString(
          36,
        )}`;
      }
    }
    return identifier;
  } else {
    return opt(fileScopeStr, refCount, debugId);
  }
}
