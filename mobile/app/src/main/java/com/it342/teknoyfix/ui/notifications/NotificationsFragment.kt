package com.it342.teknoyfix.ui.notifications

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.it342.teknoyfix.R
import com.it342.teknoyfix.api.ApiClient
import com.it342.teknoyfix.databinding.FragmentNotificationsBinding
import com.it342.teknoyfix.databinding.ItemNotificationBinding
import com.it342.teknoyfix.model.Notification
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class NotificationsFragment : Fragment() {

    private var _binding: FragmentNotificationsBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?
    ): View {
        _binding = FragmentNotificationsBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val adapter = NotificationsAdapter()
        binding.recyclerNotifications.layoutManager = LinearLayoutManager(requireContext())
        binding.recyclerNotifications.adapter = adapter

        loadNotifications(adapter)
        binding.swipeRefresh.setOnRefreshListener { loadNotifications(adapter) }
    }

    private fun loadNotifications(adapter: NotificationsAdapter) {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val res = ApiClient.getService(requireContext()).getNotifications()
                withContext(Dispatchers.Main) {
                    binding.swipeRefresh.isRefreshing = false
                    if (res.isSuccessful) adapter.submitList(res.body() ?: emptyList())
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) { binding.swipeRefresh.isRefreshing = false }
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}

class NotificationsAdapter : RecyclerView.Adapter<NotificationsAdapter.ViewHolder>() {

    private var items = listOf<Notification>()

    fun submitList(list: List<Notification>) {
        items = list
        notifyDataSetChanged()
    }

    inner class ViewHolder(private val binding: ItemNotificationBinding) :
        RecyclerView.ViewHolder(binding.root) {
        fun bind(notif: Notification) {
            binding.tvMessage.text = notif.message
            binding.tvTime.text    = notif.createdAt?.take(10) ?: ""
            binding.root.alpha     = if (notif.isRead) 0.6f else 1.0f
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int) = ViewHolder(
        ItemNotificationBinding.inflate(LayoutInflater.from(parent.context), parent, false)
    )

    override fun onBindViewHolder(holder: ViewHolder, position: Int) = holder.bind(items[position])
    override fun getItemCount() = items.size
}