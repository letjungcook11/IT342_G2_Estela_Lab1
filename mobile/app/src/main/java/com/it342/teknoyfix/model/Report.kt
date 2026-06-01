package com.it342.teknoyfix.model

data class Report(
    val id: Long = 0,
    val title: String = "",
    val description: String = "",
    val location: String = "",
    val building: String? = null,
    val room: String? = null,
    val priority: String = "LOW",
    val status: String = "PENDING",
    val imageUrl: String? = null,
    val upvotes: Int = 0,
    val createdAt: String? = null,
    val updatedAt: String? = null,
    val reporter: User? = null,
    val category: Category? = null
)