package com.it342.teknoyfix.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.it342.teknoyfix.api.ApiClient
import com.it342.teknoyfix.model.LoginRequest
import com.it342.teknoyfix.model.RegisterRequest
import com.it342.teknoyfix.utils.TokenManager
import kotlinx.coroutines.launch

class AuthViewModel(application: Application) : AndroidViewModel(application) {

    private val api = ApiClient.getService(application)
    private val tokenManager = TokenManager(application)

    val loginResult  = MutableLiveData<Result<String>>()
    val registerResult = MutableLiveData<Result<String>>()
    val loading      = MutableLiveData<Boolean>()

    fun login(email: String, password: String) {
        viewModelScope.launch {
            loading.value = true
            try {
                val res = api.login(LoginRequest(email, password))
                if (res.isSuccessful && res.body() != null) {
                    val token = res.body()!!.token
                    tokenManager.saveToken(token)
                    loginResult.value = Result.success(token)
                } else {
                    loginResult.value = Result.failure(Exception("Invalid email or password"))
                }
            } catch (e: Exception) {
                loginResult.value = Result.failure(e)
            } finally {
                loading.value = false
            }
        }
    }

    fun register(username: String, email: String, password: String, role: String) {
        viewModelScope.launch {
            loading.value = true
            try {
                val res = api.register(RegisterRequest(username, email, password, role))
                if (res.isSuccessful) {
                    registerResult.value = Result.success("Registered successfully")
                } else {
                    registerResult.value = Result.failure(Exception("Registration failed"))
                }
            } catch (e: Exception) {
                registerResult.value = Result.failure(e)
            } finally {
                loading.value = false
            }
        }
    }

    fun logout() {
        viewModelScope.launch { tokenManager.clear() }
    }
}