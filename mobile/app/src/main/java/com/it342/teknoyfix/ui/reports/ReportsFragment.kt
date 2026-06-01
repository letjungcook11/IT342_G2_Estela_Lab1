package com.it342.teknoyfix.ui.reports

import android.app.AlertDialog
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.recyclerview.widget.LinearLayoutManager
import com.it342.teknoyfix.R
import com.it342.teknoyfix.databinding.FragmentReportsBinding
import com.it342.teknoyfix.model.Category
import com.it342.teknoyfix.model.Report
import com.it342.teknoyfix.model.ReportRequest
import com.it342.teknoyfix.viewmodel.ReportsViewModel

class ReportsFragment : Fragment() {

    private var _binding: FragmentReportsBinding? = null
    private val binding get() = _binding!!
    private val viewModel: ReportsViewModel by viewModels()
    private lateinit var adapter: ReportsAdapter

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?
    ): View {
        _binding = FragmentReportsBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        adapter = ReportsAdapter(
            onUpvote = { report -> viewModel.upvote(report.id) }
        )
        binding.recyclerReports.layoutManager = LinearLayoutManager(requireContext())
        binding.recyclerReports.adapter = adapter

        viewModel.loadReports()
        viewModel.loadCategories()

        viewModel.reports.observe(viewLifecycleOwner) { adapter.submitList(it) }
        viewModel.loading.observe(viewLifecycleOwner) { binding.swipeRefresh.isRefreshing = it }

        binding.swipeRefresh.setOnRefreshListener { viewModel.loadReports() }

        binding.fabNewReport.setOnClickListener { showSubmitDialog() }
    }

    private fun showSubmitDialog() {
        val categories = viewModel.categories.value ?: emptyList()
        val dialogView = LayoutInflater.from(requireContext())
            .inflate(R.layout.dialog_submit_report, null)

        val etTitle       = dialogView.findViewById<EditText>(R.id.etTitle)
        val etDescription = dialogView.findViewById<EditText>(R.id.etDescription)
        val etLocation    = dialogView.findViewById<EditText>(R.id.etLocation)
        val spinnerCat    = dialogView.findViewById<Spinner>(R.id.spinnerCategory)
        val spinnerPrio   = dialogView.findViewById<Spinner>(R.id.spinnerPriority)

        spinnerCat.adapter = ArrayAdapter(
            requireContext(),
            android.R.layout.simple_spinner_dropdown_item,
            categories.map { it.name }
        )

        spinnerPrio.adapter = ArrayAdapter(
            requireContext(),
            android.R.layout.simple_spinner_dropdown_item,
            listOf("LOW", "MEDIUM", "HIGH", "URGENT")
        )

        AlertDialog.Builder(requireContext())
            .setTitle("Submit a Report")
            .setView(dialogView)
            .setPositiveButton("Submit") { _, _ ->
                val categoryId = categories.getOrNull(spinnerCat.selectedItemPosition)?.id ?: 0L
                viewModel.submitReport(
                    ReportRequest(
                        title       = etTitle.text.toString(),
                        description = etDescription.text.toString(),
                        location    = etLocation.text.toString(),
                        building    = null,
                        room        = null,
                        priority    = spinnerPrio.selectedItem.toString(),
                        categoryId  = categoryId
                    )
                )
            }
            .setNegativeButton("Cancel", null)
            .show()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}