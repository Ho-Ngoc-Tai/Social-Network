const STORAGE_KEY = 'comment_parents';

interface CommentCache {
  [postId: string]: {
    [commentId: string]: string | null;  // parent comment id
  };
}

export function getCommentParents(postId: string): { [commentId: string]: string | null } {
  if (typeof window === 'undefined') return {};
  try {
    const cache: CommentCache = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const result = cache[postId] || {};
    console.log('[Cache] Get parents for', postId, result);
    return result;
  } catch (e) {
    console.error('[Cache] Get failed:', e);
    return {};
  }
}

export function setCommentParent(postId: string, commentId: string, parentId: string | null): void {
  if (typeof window === 'undefined') return;
  try {
    const cache: CommentCache = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    if (!cache[postId]) cache[postId] = {};
    cache[postId][commentId] = parentId;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
    console.log('[Cache] Saved:', postId, commentId, '->', parentId);
  } catch (e) {
    console.error('[Cache] Save failed:', e);
  }
}

export function clearPostComments(postId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const cache: CommentCache = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    delete cache[postId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch {
    // ignore
  }
}
