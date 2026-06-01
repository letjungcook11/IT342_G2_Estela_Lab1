package com.it342.teknoyfix.model

data class History(
    val id: Long = 0,
    val report: Report? = null,
    val changedBy: User? = null,
    val oldStatus: String? = null,
    val newStatus: String = "",
    val notes: String? = null,
    val changedAt: String? = null
)