package com.it342.teknoyfix.ui.reports

import android.view.LayoutInflater
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.it342.teknoyfix.R
import com.it342.teknoyfix.databinding.ItemReportBinding
import com.it342.teknoyfix.model.Report

class ReportsAdapter(
    private val onUpvote: (Report) -> Unit
) : ListAdapter<Report, ReportsAdapter.ViewHolder>(DiffCallback()) {

    inner class ViewHolder(private val binding: ItemReportBinding) :
        RecyclerView.ViewHolder(binding.root) {

        fun bind(report: Report) {
            binding.tvTitle.text = report.title
            binding.tvMeta.text = buildString {
                report.building?.let { append("$it · ") }
                append(report.location)
                report.category?.let { append(" · ${it.name}") }
            }
            binding.tvDescription.text = report.description
            binding.tvStatus.text = report.status
            binding.tvPriority.text = report.priority
            binding.tvUpvotes.text = "${report.upvotes} people affected"

            binding.root.setOnClickListener { onUpvote(report) }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        return ViewHolder(
            ItemReportBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        )
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.bind(getItem(position))
    }

    class DiffCallback : DiffUtil.ItemCallback<Report>() {
        override fun areItemsTheSame(oldItem: Report, newItem: Report) = oldItem.id == newItem.id
        override fun areContentsTheSame(oldItem: Report, newItem: Report) = oldItem == newItem
    }
}