import { retrieveRawInitData } from '@telegram-apps/sdk'

export function initTelegram() {
  const initData = retrieveRawInitData() as string
  setTelegramInitData(initData)
}

export function setTelegramInitData(initData: string) {
  localStorage.setItem('telegramInitData', initData)
}

export function getTelegramInitData() {
  return localStorage.getItem('telegramInitData')
}
