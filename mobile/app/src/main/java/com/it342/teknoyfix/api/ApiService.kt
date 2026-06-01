package com.it342.teknoyfix.api

import com.it342.teknoyfix.model.*
import retrofit2.Response
import retrofit2.http.*

interface ApiService {

    // Auth
    @POST("api/auth/login")
    suspend fun login(@Body request: LoginRequest): Response<JwtResponse>

    @POST("api/auth/register")
    suspend fun register(@Body request: RegisterRequest): Response<String>

    // User
    @GET("api/user/me")
    suspend fun getMe(): Response<User>

    @PUT("api/profile")
    suspend fun updateProfile(@Body body: Map<String, String>): Response<User>

    // Reports
    @GET("api/reports")
    suspend fun getReports(): Response<List<Report>>

    @POST("api/reports")
    suspend fun createReport(@Body request: ReportRequest): Response<Report>

    @PUT("api/reports/{id}/status")
    suspend fun updateStatus(
        @Path("id") id: Long,
        @Body request: StatusUpdateRequest
    ): Response<Report>

    @POST("api/reports/{id}/assign")
    suspend fun assignReport(
        @Path("id") id: Long,
        @Body request: AssignRequest
    ): Response<Assignment>

    @POST("api/reports/{id}/upvote")
    suspend fun upvoteReport(@Path("id") id: Long): Response<Map<String, Int>>

    @DELETE("api/reports/{id}/upvote")
    suspend fun removeUpvote(@Path("id") id: Long): Response<Map<String, Int>>

    @POST("api/reports/{id}/rate")
    suspend fun rateReport(
        @Path("id") id: Long,
        @Body request: RateRequest
    ): Response<Assignment>

    @GET("api/reports/categories")
    suspend fun getCategories(): Response<List<Category>>

    @GET("api/reports/history")
    suspend fun getHistory(): Response<List<History>>

    @GET("api/reports/ticker")
    suspend fun getTicker(): Response<List<Map<String, String>>>

    @GET("api/reports/check-duplicate")
    suspend fun checkDuplicate(
        @Query("title") title: String,
        @Query("building") building: String?,
        @Query("location") location: String?
    ): Response<Map<String, Any>>

    // Notifications
    @GET("api/notifications")
    suspend fun getNotifications(): Response<List<Notification>>

    @GET("api/notifications/unread-count")
    suspend fun getUnreadCount(): Response<Map<String, Int>>

    @PUT("api/notifications/mark-all-read")
    suspend fun markAllRead(): Response<Map<String, Int>>

    // Users
    @GET("api/user/all")
    suspend fun getAllUsers(): Response<List<User>>
}