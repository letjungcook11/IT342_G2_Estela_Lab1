package com.it342.teknoyfix.ui.dashboard

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.navigation.fragment.NavHostFragment
import androidx.navigation.ui.setupWithNavController
import com.it342.teknoyfix.R
import com.it342.teknoyfix.databinding.ActivityDashboardBinding
import com.it342.teknoyfix.ui.auth.LoginActivity
import com.it342.teknoyfix.utils.TokenManager
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class DashboardActivity : AppCompatActivity() {

    private lateinit var binding: ActivityDashboardBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityDashboardBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setSupportActionBar(binding.toolbar)

        val navHost = supportFragmentManager
            .findFragmentById(R.id.navHostFragment) as NavHostFragment
        val navController = navHost.navController

        binding.bottomNav.setupWithNavController(navController)

        // Update toolbar title on navigation
        navController.addOnDestinationChangedListener { _, destination, _ ->
            binding.toolbar.title = destination.label
        }
    }

    fun logout() {
        CoroutineScope(Dispatchers.Main).launch {
            TokenManager(this@DashboardActivity).clear()
            startActivity(Intent(this@DashboardActivity, LoginActivity::class.java))
            finish()
        }
    }
}