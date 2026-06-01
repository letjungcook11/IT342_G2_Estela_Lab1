package com.it342.teknoyfix.ui.auth

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.ArrayAdapter
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import com.it342.teknoyfix.databinding.ActivityRegisterBinding
import com.it342.teknoyfix.viewmodel.AuthViewModel

class RegisterActivity : AppCompatActivity() {

    private lateinit var binding: ActivityRegisterBinding
    private val viewModel: AuthViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityRegisterBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupSpinner()
        setupObservers()
        setupListeners()
    }

    private fun setupSpinner() {
        val roles = listOf("Student", "Employee / Staff")
        binding.spinnerRole.adapter = ArrayAdapter(
            this, android.R.layout.simple_spinner_dropdown_item, roles
        )
    }

    private fun setupObservers() {
        viewModel.loading.observe(this) { loading ->
            binding.btnRegister.isEnabled = !loading
            binding.btnRegister.text = if (loading) "Creating account..." else "Create Account"
        }

        viewModel.registerResult.observe(this) { result ->
            result.onSuccess {
                startActivity(Intent(this, LoginActivity::class.java))
                finish()
            }.onFailure { e ->
                showError(e.message ?: "Registration failed")
            }
        }
    }

    private fun setupListeners() {
        binding.btnBack.setOnClickListener { finish() }

        binding.tvLogin.setOnClickListener { finish() }

        binding.btnRegister.setOnClickListener {
            val username = binding.etUsername.text.toString().trim()
            val email    = binding.etEmail.text.toString().trim()
            val password = binding.etPassword.text.toString()
            val confirm  = binding.etConfirm.text.toString()
            val role     = if (binding.spinnerRole.selectedItemPosition == 0)
                "STUDENT" else "EMPLOYEE"

            if (username.isEmpty() || email.isEmpty() || password.isEmpty()) {
                showError("Please fill in all fields"); return@setOnClickListener
            }
            if (password.length < 6) {
                showError("Password must be at least 6 characters"); return@setOnClickListener
            }
            if (password != confirm) {
                showError("Passwords do not match"); return@setOnClickListener
            }

            hideError()
            viewModel.register(username, email, password, role)
        }
    }

    private fun showError(message: String) {
        binding.tvError.text = message
        binding.tvError.visibility = View.VISIBLE
    }

    private fun hideError() {
        binding.tvError.visibility = View.GONE
    }
}