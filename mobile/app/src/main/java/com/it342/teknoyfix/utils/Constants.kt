package com.it342.teknoyfix.utils

object Constants {
    const val BASE_URL = "http://10.0.2.2:8080/"
    // 10.0.2.2 is how Android emulator reaches localhost on your machine
    // Change to your actual IP when testing on a real device e.g. "http://192.168.1.x:8080/"

    const val TOKEN_KEY = "auth_token"
    const val ROLE_KEY  = "user_role"

    // Report priorities
    const val PRIORITY_LOW    = "LOW"
    const val PRIORITY_MEDIUM = "MEDIUM"
    const val PRIORITY_HIGH   = "HIGH"
    const val PRIORITY_URGENT = "URGENT"

    // Report statuses
    const val STATUS_PENDING    = "PENDING"
    const val STATUS_ASSIGNED   = "ASSIGNED"
    const val STATUS_IN_PROGRESS = "IN_PROGRESS"
    const val STATUS_COMPLETED  = "COMPLETED"

    // Roles
    const val ROLE_STUDENT  = "STUDENT"
    const val ROLE_EMPLOYEE = "EMPLOYEE"

    // Poll interval
    const val POLL_INTERVAL_MS = 30000L
}