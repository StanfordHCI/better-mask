export const getFacebookShareLink = (url) => {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
}

export const getTwitterShareLink = (url, blurb) => {
  const text = blurb + ' ' + url;
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
}

export const getMessengerShareLink = (url) => {
  return `https://www.facebook.com/dialog/send?link=${encodeURIComponent(url)}&app_id=<FB APP ID>&redirect_uri=${encodeURIComponent('https://<FB REDIRECT URI>')}`
}

export const getRedditShareLink = (url, blurb) => {
  return `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(blurb)}`;
}

export const getEmailShareLink = (url, blurb) => {
  return `mailto:?&subject=${encodeURIComponent(blurb)}&body=${encodeURIComponent(url)}`
}
