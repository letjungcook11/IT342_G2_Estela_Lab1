package com.it342.teknoyfix.ui.profile

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import com.bumptech.glide.Glide
import com.it342.teknoyfix.databinding.FragmentProfileBinding
import com.it342.teknoyfix.ui.dashboard.DashboardActivity
import com.it342.teknoyfix.viewmodel.ProfileViewModel

class ProfileFragment : Fragment() {

    private var _binding: FragmentProfileBinding? = null
    private val binding get() = _binding!!
    private val viewModel: ProfileViewModel by viewModels()
    private var isEditing = false

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?
    ): View {
        _binding = FragmentProfileBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        viewModel.loadProfile()

        viewModel.user.observe(viewLifecycleOwner) { user ->
            binding.tvUsername.text  = user.username
            binding.tvEmail.text     = user.email
            binding.tvRole.text      = user.role
            binding.etFullName.setText(user.fullName ?: "")
            binding.etDepartment.setText(user.department ?: "")
            binding.etPhone.setText(user.phone ?: "")

            user.profilePictureUrl?.let { url ->
                Glide.with(this).load(url).into(binding.ivAvatar)
            }
        }

        binding.btnEdit.setOnClickListener {
            if (!isEditing) {
                isEditing = true
                binding.etFullName.isEnabled   = true
                binding.etDepartment.isEnabled = true
                binding.etPhone.isEnabled      = true
                binding.btnEdit.text           = "Save Changes"
            } else {
                val data = mapOf(
                    "fullName"   to binding.etFullName.text.toString(),
                    "department" to binding.etDepartment.text.toString(),
                    "phone"      to binding.etPhone.text.toString()
                )
                viewModel.updateProfile(data)
                isEditing = false
                binding.etFullName.isEnabled   = false
                binding.etDepartment.isEnabled = false
                binding.etPhone.isEnabled      = false
                binding.btnEdit.text           = "Edit Profile"
            }
        }

        binding.btnLogout.setOnClickListener {
            (activity as? DashboardActivity)?.logout()
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}