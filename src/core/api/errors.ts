import axios from "axios"

import type { ErrorResponse } from "@/core/api/types"

const ERROR_MESSAGES: Record<string, string> = {
  AUTH_001: "The username or password is incorrect.",
  AUTH_002: "We couldn't find that user.",
  AUTH_003: "That username is already taken.",
  AUTH_004: "That email is already registered.",
  AUTH_005: "Your session expired. Please sign in again.",
  ACC_001: "Account not found.",
  ACC_002: "Insufficient funds.",
  ACC_003: "Cannot transfer to the same account.",
  ACC_004: "That account does not belong to you.",
  TXN_001: "Enter a valid amount.",
  TXN_003: "That transaction can't be used here.",
  TXN_004: "Transaction not found.",
  VAL_001: "Check the highlighted fields and try again.",
  GEN_001: "Something went wrong. Please try again.",
}

export const NETWORK_ERROR_MESSAGE =
  "We couldn't reach the bank. Check your connection and try again."

export const GENERIC_ERROR_MESSAGE = "Something went wrong. Please try again."

function isErrorResponse(value: unknown): value is ErrorResponse {
  if (!value || typeof value !== "object") {
    return false
  }

  return typeof (value as ErrorResponse).code === "string"
}

export function getErrorMessage(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return GENERIC_ERROR_MESSAGE
  }

  if (!error.response) {
    return NETWORK_ERROR_MESSAGE
  }

  const data = error.response.data
  if (!isErrorResponse(data)) {
    return GENERIC_ERROR_MESSAGE
  }

  return ERROR_MESSAGES[data.code] ?? GENERIC_ERROR_MESSAGE
}
