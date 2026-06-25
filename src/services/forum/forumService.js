import {
  forumCategories,
  forumThreads,
} from '../../data/forum/forumData.js'

function buildResponse(message, data) {
  return {
    success: true,
    message,
    data,
  }
}

function createAvatar(name) {
  return String(name || 'CyberVault User')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2)
}

export async function getForumThreads() {
  return Promise.resolve(buildResponse('Thread forum berhasil dimuat.', forumThreads))
}

export async function getForumCategories() {
  return Promise.resolve(buildResponse('Kategori forum berhasil dimuat.', forumCategories))
}

export async function createThread(payload) {
  const sanitizedTitle = String(payload.title || '').trim()
  const sanitizedContent = String(payload.content || '').trim()
  const category = String(payload.category || '').trim()
  const tags = Array.isArray(payload.tags) ? payload.tags : []

  return Promise.resolve(
    buildResponse('Diskusi mock berhasil dibuat.', {
      id: `thread-${Date.now()}`,
      title: sanitizedTitle,
      category,
      status: 'open',
      author: String(payload.author || 'CyberVault User').trim(),
      role: String(payload.role || 'Community Member').trim(),
      createdAt: new Date().toISOString().slice(0, 10),
      summary: sanitizedContent.slice(0, 120),
      content: sanitizedContent,
      tags,
      likes: 0,
      likedByCurrentUser: false,
      saved: false,
      reported: false,
      views: 1,
      comments: [],
      avatar: createAvatar(payload.author),
    }),
  )
}

export async function addComment(threadId, payload) {
  const content = String(payload.content || '').trim()

  return Promise.resolve(
    buildResponse('Komentar mock berhasil ditambahkan.', {
      threadId,
      comment: {
        id: `comment-${Date.now()}`,
        author: String(payload.author || 'CyberVault User').trim(),
        role: String(payload.role || 'Community Member').trim(),
        createdAt: new Date().toISOString().slice(0, 10),
        content,
      },
    }),
  )
}

export async function likeThread(threadId, likedByCurrentUser, likes) {
  const nextLikedState = !likedByCurrentUser
  const nextLikes = nextLikedState ? likes + 1 : Math.max(likes - 1, 0)

  return Promise.resolve(
    buildResponse('Status like thread berhasil diperbarui.', {
      threadId,
      likedByCurrentUser: nextLikedState,
      likes: nextLikes,
    }),
  )
}

export async function saveThread(threadId, saved) {
  return Promise.resolve(
    buildResponse('Status simpan thread berhasil diperbarui.', {
      threadId,
      saved: !saved,
    }),
  )
}

export async function reportThread(threadId, reason) {
  return Promise.resolve(
    buildResponse('Thread berhasil dilaporkan pada mode demo.', {
      threadId,
      reported: true,
      status: 'reported',
      reason: String(reason || '').trim(),
    }),
  )
}

export async function closeThread(threadId) {
  return Promise.resolve(
    buildResponse('Thread berhasil ditandai closed pada mode demo.', {
      threadId,
      status: 'closed',
    }),
  )
}
