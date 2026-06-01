package com.it342.teknoyfix.ui.dashboard

import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import com.it342.teknoyfix.R
import com.it342.teknoyfix.databinding.FragmentDashboardBinding
import com.it342.teknoyfix.model.Report
import com.it342.teknoyfix.viewmodel.ReportsViewModel
import java.util.Calendar

class DashboardFragment : Fragment() {

    private var _binding: FragmentDashboardBinding? = null
    private val binding get() = _binding!!
    private val viewModel: ReportsViewModel by viewModels()
    private val handler = Handler(Looper.getMainLooper())
    private var tickerList = listOf<Map<String, String>>()
    private var tickerIndex = 0

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?
    ): View {
        _binding = FragmentDashboardBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        setupGreeting()
        setupObservers()
        viewModel.loadReports()

        binding.swipeRefresh.setOnRefreshListener {
            viewModel.loadReports()
        }

        // Poll every 30 seconds
        startPolling()
    }

    private fun setupGreeting() {
        val hour = Calendar.getInstance().get(Calendar.HOUR_OF_DAY)
        val greeting = when {
            hour < 12 -> "Good morning"
            hour < 18 -> "Good afternoon"
            else -> "Good evening"
        }
        binding.tvGreeting.text = "$greeting 👋"
        binding.tvSubtitle.text = "Here's your campus overview."
    }

    private fun setupObservers() {
        viewModel.loading.observe(viewLifecycleOwner) { loading ->
            binding.swipeRefresh.isRefreshing = loading
        }

        viewModel.reports.observe(viewLifecycleOwner) { reports ->
            updateStats(reports)
            updateRecentReports(reports)
        }
    }

    private fun updateStats(reports: List<Report>) {
        val total     = reports.size
        val pending   = reports.count { it.status == "PENDING" }
        val inprog    = reports.count { it.status == "IN_PROGRESS" || it.status == "ASSIGNED" }
        val completed = reports.count { it.status == "COMPLETED" }
        val urgent    = reports.count { it.priority == "URGENT" }

        binding.cardTotal.findViewById<TextView>(R.id.tvStatValue).text = total.toString()
        binding.cardTotal.findViewById<TextView>(R.id.tvStatLabel).text = "Total"

        binding.cardPending.findViewById<TextView>(R.id.tvStatValue).text = pending.toString()
        binding.cardPending.findViewById<TextView>(R.id.tvStatLabel).text = "Pending"

        binding.cardInProgress.findViewById<TextView>(R.id.tvStatValue).text = inprog.toString()
        binding.cardInProgress.findViewById<TextView>(R.id.tvStatLabel).text = "In Progress"

        binding.cardCompleted.findViewById<TextView>(R.id.tvStatValue).text = completed.toString()
        binding.cardCompleted.findViewById<TextView>(R.id.tvStatLabel).text = "Completed"

        binding.cardUrgent.findViewById<TextView>(R.id.tvStatValue).text = urgent.toString()
        binding.cardUrgent.findViewById<TextView>(R.id.tvStatLabel).text = "Urgent"
    }

    private fun updateRecentReports(reports: List<Report>) {
        val recent = reports.sortedByDescending { it.createdAt }.take(5)
        binding.recentReportsContainer.removeAllViews()

        if (recent.isEmpty()) {
            binding.tvNoReports.visibility = View.VISIBLE
            return
        }

        binding.tvNoReports.visibility = View.GONE
        recent.forEach { report ->
            val itemView = LayoutInflater.from(requireContext())
                .inflate(R.layout.item_report, binding.recentReportsContainer, false)

            itemView.findViewById<TextView>(R.id.tvTitle).text = report.title
            itemView.findViewById<TextView>(R.id.tvMeta).text =
                "${report.building ?: report.location} · ${report.category?.name}"
            itemView.findViewById<TextView>(R.id.tvDescription).text = report.description
            itemView.findViewById<TextView>(R.id.tvStatus).text = report.status
            itemView.findViewById<TextView>(R.id.tvPriority).text = report.priority
            itemView.findViewById<TextView>(R.id.tvUpvotes).text =
                "${report.upvotes} people affected"

            binding.recentReportsContainer.addView(itemView)
        }
    }

    private fun startPolling() {
        handler.postDelayed(object : Runnable {
            override fun run() {
                viewModel.loadReports()
                handler.postDelayed(this, 30000)
            }
        }, 30000)
    }

    override fun onDestroyView() {
        super.onDestroyView()
        handler.removeCallbacksAndMessages(null)
        _binding = null
    }
}