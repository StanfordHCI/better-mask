export const getFacebookShareLink = (url) => {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
}

export const getTwitterShareLink = (url) => {
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(url)}`
}

export const getMessengerShareLink = (url) => {
  return `https://www.facebook.com/dialog/send?link=${encodeURIComponent(url)}&app_id=<FB APP ID>&redirect_uri=${encodeURIComponent('https://<FB REDIRECT URI>')}`
}

export const getRedditShareLink = (url) => {
  return `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent('Join me on Tori.land!')}`;
}

export const getEmailShareLink = (url) => {
  return `mailto:?&subject=${encodeURIComponent('Join me on Tori.Land!')}&body=${encodeURIComponent(url)}`
}
