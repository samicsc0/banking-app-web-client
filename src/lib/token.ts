export const getAccessToken = () => localStorage.getItem("kifiya_access_token")
export const getRefreshToken = () =>
  localStorage.getItem("kifiya_refresh_token")

export const setTokens = (access: string, refresh: string) => {
  localStorage.setItem("kifiya_access_token", access)
  localStorage.setItem("kifiya_refresh_token", refresh)
}
export const clearTokens = () => {
  localStorage.removeItem("kifiya_access_token")
  localStorage.removeItem("kifiya_refresh_token")
}
