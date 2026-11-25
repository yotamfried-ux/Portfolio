// Public profile links. GitHub is the owner's public profile. LinkedIn and CV render only when the owner provides
// an https URL (PUBLIC_LINKEDIN_URL, PUBLIC_CV_URL); nothing is invented.
export const githubUrl = 'https://github.com/yotamfried-ux'

function httpsUrl(value?: string) {
  try {
    const url = new URL(value?.trim() ?? '')
    return url.protocol === 'https:' ? url.toString() : undefined
  } catch {
    return undefined
  }
}

export function publicProfiles() {
  return {
    github: githubUrl,
    linkedin: httpsUrl(process.env.PUBLIC_LINKEDIN_URL),
    cv: httpsUrl(process.env.PUBLIC_CV_URL),
  }
}
