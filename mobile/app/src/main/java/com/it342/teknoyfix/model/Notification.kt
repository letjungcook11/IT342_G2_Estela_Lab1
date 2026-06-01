package com.it342.teknoyfix.model

data class Notification(
    val id: Long = 0,
    val message: String = "",
    val isRead: Boolean = false,
    val createdAt: String? = null
)