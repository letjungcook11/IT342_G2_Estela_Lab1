package com.it342.teknoyfix.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.it342.teknoyfix.api.ApiClient
import com.it342.teknoyfix.model.History
import kotlinx.coroutines.launch

class HistoryViewModel(application: Application) : AndroidViewModel(application) {

    private val api = ApiClient.getService(application)

    val history = MutableLiveData<List<History>>()
    val loading = MutableLiveData<Boolean>()
    val error   = MutableLiveData<String>()

    fun loadHistory() {
        viewModelScope.launch {
            loading.value = true
            try {
                val res = api.getHistory()
                if (res.isSuccessful) history.value = res.body() ?: emptyList()
                else error.value = "Failed to load history"
            } catch (e: Exception) {
                error.value = e.message
            } finally {
                loading.value = false
            }
        }
    }
}