package com.it342.teknoyfix.ui.history

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.it342.teknoyfix.databinding.ItemHistoryBinding
import com.it342.teknoyfix.model.History

class HistoryAdapter : ListAdapter<History, HistoryAdapter.ViewHolder>(DiffCallback()) {

    inner class ViewHolder(private val binding: ItemHistoryBinding) :
        RecyclerView.ViewHolder(binding.root) {

        fun bind(history: History) {
            binding.tvReportTitle.text = history.report?.title ?: "Unknown Report"
            binding.tvTime.text = history.changedAt?.take(10) ?: ""
            binding.tvOldStatus.text = history.oldStatus ?: "NEW"
            binding.tvNewStatus.text = history.newStatus
            binding.tvDetails.text = buildString {
                history.report?.location?.let { append(it) }
                history.changedBy?.let { append(" · by ${it.username}") }
                history.notes?.let { if (it.isNotBlank()) append(" · $it") }
            }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        return ViewHolder(
            ItemHistoryBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        )
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.bind(getItem(position))
    }

    class DiffCallback : DiffUtil.ItemCallback<History>() {
        override fun areItemsTheSame(oldItem: History, newItem: History) = oldItem.id == newItem.id
        override fun areContentsTheSame(oldItem: History, newItem: History) = oldItem == newItem
    }
}