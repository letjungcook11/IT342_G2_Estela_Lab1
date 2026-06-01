package com.it342.teknoyfix.utils

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map

val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "teknoyfix_prefs")

class TokenManager(private val context: Context) {

    private val TOKEN_KEY = stringPreferencesKey(Constants.TOKEN_KEY)
    private val ROLE_KEY  = stringPreferencesKey(Constants.ROLE_KEY)

    suspend fun saveToken(token: String) {
        context.dataStore.edit { it[TOKEN_KEY] = token }
    }

    suspend fun getToken(): String? {
        return context.dataStore.data.map { it[TOKEN_KEY] }.first()
    }

    suspend fun saveRole(role: String) {
        context.dataStore.edit { it[ROLE_KEY] = role }
    }

    suspend fun getRole(): String? {
        return context.dataStore.data.map { it[ROLE_KEY] }.first()
    }

    suspend fun clear() {
        context.dataStore.edit { it.clear() }
    }

    suspend fun isLoggedIn(): Boolean {
        return !getToken().isNullOrBlank()
    }
}