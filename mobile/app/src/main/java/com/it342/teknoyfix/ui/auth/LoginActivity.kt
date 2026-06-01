package com.it342.teknoyfix.ui.auth

import android.content.Intent
import android.os.Bundle
import android.view.View
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import com.it342.teknoyfix.databinding.ActivityLoginBinding
import com.it342.teknoyfix.ui.dashboard.DashboardActivity
import com.it342.teknoyfix.utils.Constants
import com.it342.teknoyfix.utils.TokenManager
import com.it342.teknoyfix.viewmodel.AuthViewModel
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class LoginActivity : AppCompatActivity() {

    private lateinit var binding: ActivityLoginBinding
    private val viewModel: AuthViewModel by viewModels()
    private lateinit var tokenManager: TokenManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)

        tokenManager = TokenManager(this)

        // Auto-login if token exists
        CoroutineScope(Dispatchers.Main).launch {
            if (tokenManager.isLoggedIn()) {
                goToDashboard()
                return@launch
            }
        }

        setupObservers()
        setupListeners()
    }

    private fun setupObservers() {
        viewModel.loading.observe(this) { loading ->
            binding.btnLogin.isEnabled = !loading
            binding.btnLogin.text = if (loading) "Signing in..." else "Sign In"
        }

        viewModel.loginResult.observe(this) { result ->
            result.onSuccess {
                goToDashboard()
            }.onFailure { e ->
                showError(e.message ?: "Login failed")
            }
        }
    }

    private fun setupListeners() {
        binding.btnLogin.setOnClickListener {
            val email    = binding.etEmail.text.toString().trim()
            val password = binding.etPassword.text.toString()

            if (email.isEmpty() || password.isEmpty()) {
                showError("Please fill in all fields")
                return@setOnClickListener
            }
            hideError()
            viewModel.login(email, password)
        }

        binding.tvRegister.setOnClickListener {
            startActivity(Intent(this, RegisterActivity::class.java))
        }

        binding.btnGoogle.setOnClickListener {
            // Open backend OAuth2 endpoint in browser
            val intent = Intent(
                android.content.Intent.ACTION_VIEW,
                android.net.Uri.parse("http://10.0.2.2:8080/oauth2/authorization/google")
            )
            startActivity(intent)
        }
    }

    private fun showError(message: String) {
        binding.tvError.text = message
        binding.tvError.visibility = View.VISIBLE
    }

    private fun hideError() {
        binding.tvError.visibility = View.GONE
    }

    private fun goToDashboard() {
        startActivity(Intent(this, DashboardActivity::class.java))
        finish()
    }
}