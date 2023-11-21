import React, { useContext, createContext, FC, useState } from 'react'

type AccessTokenContext = [
  string,
  React.Dispatch<React.SetStateAction<string>>
]
const AccessToken = React.createContext({} as AccessTokenContext);

const AccessTokenProvider = (props: any) => {
  const [accessToken, setAccessToken] = useState<string>(null)
  return <AccessToken.Provider value={[accessToken, setAccessToken]} {...props} />
}

const useAccessToken = (): AccessTokenContext => useContext<AccessTokenContext>(AccessToken)

export { AccessTokenProvider, useAccessToken }