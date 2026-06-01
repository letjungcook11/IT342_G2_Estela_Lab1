package com.it342.teknoyfix.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.it342.teknoyfix.api.ApiClient
import com.it342.teknoyfix.model.*
import kotlinx.coroutines.launch

class ReportsViewModel(application: Application) : AndroidViewModel(application) {

    private val api = ApiClient.getService(application)

    val reports    = MutableLiveData<List<Report>>()
    val categories = MutableLiveData<List<Category>>()
    val loading    = MutableLiveData<Boolean>()
    val error      = MutableLiveData<String>()
    val submitResult = MutableLiveData<Result<Report>>()

    fun loadReports() {
        viewModelScope.launch {
            loading.value = true
            try {
                val res = api.getReports()
                if (res.isSuccessful) reports.value = res.body() ?: emptyList()
                else error.value = "Failed to load reports"
            } catch (e: Exception) {
                error.value = e.message
            } finally {
                loading.value = false
            }
        }
    }

    fun loadCategories() {
        viewModelScope.launch {
            try {
                val res = api.getCategories()
                if (res.isSuccessful) categories.value = res.body() ?: emptyList()
            } catch (e: Exception) {
                error.value = e.message
            }
        }
    }

    fun submitReport(request: ReportRequest) {
        viewModelScope.launch {
            loading.value = true
            try {
                val res = api.createReport(request)
                if (res.isSuccessful && res.body() != null) {
                    submitResult.value = Result.success(res.body()!!)
                    loadReports()
                } else {
                    submitResult.value = Result.failure(Exception("Failed to submit report"))
                }
            } catch (e: Exception) {
                submitResult.value = Result.failure(e)
            } finally {
                loading.value = false
            }
        }
    }

    fun updateStatus(id: Long, status: String) {
        viewModelScope.launch {
            try {
                api.updateStatus(id, StatusUpdateRequest(status))
                loadReports()
            } catch (e: Exception) {
                error.value = e.message
            }
        }
    }

    fun upvote(id: Long) {
        viewModelScope.launch {
            try {
                api.upvoteReport(id)
                loadReports()
            } catch (e: Exception) {
                error.value = e.message
            }
        }
    }
}