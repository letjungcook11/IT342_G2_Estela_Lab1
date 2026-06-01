package com.it342.teknoyfix.model

data class ReportRequest(
    val title: String,
    val description: String,
    val location: String,
    val building: String?,
    val room: String?,
    val priority: String,
    val categoryId: Long
)

data class StatusUpdateRequest(
    val status: String,
    val notes: String = ""
)

data class AssignRequest(
    val employeeId: Long
)

data class RateRequest(
    val rating: Int,
    val feedback: String = ""
)