package com.it342.teknoyfix.model

data class LoginRequest(
    val email: String,
    val password: String
)

data class RegisterRequest(
    val username: String,
    val email: String,
    val password: String,
    val role: String = "STUDENT"
)

data class JwtResponse(
    val token: String
)