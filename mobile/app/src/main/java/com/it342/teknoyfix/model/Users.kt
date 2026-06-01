package com.it342.teknoyfix.model

data class User(
    val id: Long = 0,
    val email: String = "",
    val username: String = "",
    val role: String = "STUDENT",
    val fullName: String? = null,
    val department: String? = null,
    val phone: String? = null,
    val profilePictureUrl: String? = null,
    val createdAt: String? = null
)